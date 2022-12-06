import { useRef, useEffect, useMemo } from 'react';
import { useLoadScript } from '../util/useLoadScript';
import useLocalStorage from '../util/useLocalStorage';

import { GoogleTokens, exchangeCodeForToken } from './authApi';
import { GoogleAuthProvider } from './googleAuthProvider';
declare global {
  interface Window {
    google: any;
  }
}

function GoogleLoginRequired({children, scope} : any) {
  const [tokens, setTokens] = useLocalStorage<GoogleTokens | null>('tokens', null);

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
              setTokens(null);
            }
          } catch (e) {
            console.error(e);
            setTokens(null);
          }
        }
      });
    }
  }, [scope, gisStatus, setTokens]);

  // Function for initiating login via GIS
  const login = () => {
    GISClientRef.current.requestCode();
  }

  const logout = () => {
    setTokens(null);
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
    return (<button onClick={login}>Login</button>);
  }

  return (
    <GoogleAuthProvider.Provider value={providerValue}>
      <button onClick={logout}>Logout</button>
      {children}
    </GoogleAuthProvider.Provider>
  );
}

export default GoogleLoginRequired;
