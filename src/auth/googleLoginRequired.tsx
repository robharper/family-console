import { useRef, useEffect, useMemo } from 'react';
import { useLoadScript } from '../util/useLoadScript';
import { useLocalStorage } from 'react-use';

import { exchangeCodeForToken, refreshToken } from './authApi';
import { GoogleAuthProvider } from './googleAuthProvider';
import { GoogleTokens } from '../google/types';
declare global {
  interface Window {
    google: any;
  }
}

const EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 min
const TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 min

interface GoogleLoginRequiredParams {
  children: JSX.Element | JSX.Element[];
  scope: string;
}

function GoogleLoginRequired({children, scope} : GoogleLoginRequiredParams) {
  const [tokens, setTokens, clearTokens] = useLocalStorage<GoogleTokens>('tokens');

  // Are our tokens about to expire?
  if (tokens?.refresh_token != null && tokens?.expiry_date != null && Date.now() > tokens?.expiry_date - EXPIRY_BUFFER_MS) {
    // Token refresh needed
    console.log('Tokens are old, refreshing tokens');
    refreshToken(tokens).then(result => setTokens(result)).catch(e => {
      console.error('Error refreshing tokens', e);
      clearTokens();
    });
  }

  // When we have new tokens, refresh after a predefined period
  useEffect(() => {
    if (tokens != null) {
      const timeoutHandle = setTimeout(() => {
        refreshToken(tokens).then(result => setTokens(result)).catch(e => {
          console.error('Error refreshing tokens', e);
          clearTokens();
        });
      }, TOKEN_REFRESH_INTERVAL);
      return () => clearTimeout(timeoutHandle);
    };
  }, [tokens]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load GSI, setup, and store in GISClientRef
  const GISClientRef = useRef<any>();
  const gisStatus = useLoadScript('https://accounts.google.com/gsi/client');

  useEffect(() => {
    if (gisStatus === 'done') {
      GISClientRef.current = window.google.accounts.oauth2.initCodeClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: scope,
        callback: async (tokenResponse: any) => {
          // Got a code, now exchange for tokens
          try {
            const data = await exchangeCodeForToken(tokenResponse);
            if (data?.access_token) {
              setTokens(data);
            } else {
              // Failed to get token, logged out
              clearTokens();
            }
          } catch (e) {
            console.error(e);
            clearTokens();
          }
        }
      });
    }
  }, [scope, gisStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // Function for initiating login via GIS
  const login = () => {
    GISClientRef.current.requestCode();
  }

  const logout = () => {
    clearTokens();
  }

  const providerValue = useMemo(() => ({
    tokens,
    setTokens,
    logout
  }), [tokens]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check for script availability, login status
  if (gisStatus === 'loading') {
    return (<h1>Loading</h1>);
  }
  if (gisStatus === 'error') {
    return (<h1>Cannot load Google GIS library</h1>);
  }
  if (tokens == null) {
    return (
      <div className="grid h-screen place-items-center ">
        <button onClick={login} className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
      </div>
    );
  }

  return (
    <GoogleAuthProvider.Provider value={providerValue}>
      {children}
    </GoogleAuthProvider.Provider>
  );
}

export default GoogleLoginRequired;
