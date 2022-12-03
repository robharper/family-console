import { useState, useRef, useEffect } from 'react';
import { useLoadScript } from '../util/useLoadScript';

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

function GoogleLoginRequired({children} : any) {
  const [tokens, setTokens] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem('tokens');
    const initialValue = saved != null && JSON.parse(saved);
    return initialValue || null;
  });
  const [googleAPI, setGoogleAPI] = useState<typeof gapi.client | null>(null);

  // Load GSI, setup, and store in GISClientRef
  const GISClientRef = useRef<any>();
  const gisStatus = useLoadScript('https://accounts.google.com/gsi/client');
  useEffect(() => {
    if (gisStatus === 'done') {
      GISClientRef.current = window.google.accounts.oauth2.initCodeClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: 'email https://www.googleapis.com/auth/calendar.readonly',
        callback: async (tokenResponse: any) => {
          console.log(tokenResponse);
          const response = await fetch('/token', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(tokenResponse) // body data type must match "Content-Type" header
          });
          try {
            const data = await response.json();
            if (data?.access_token) {
              localStorage.setItem('tokens', JSON.stringify(data));
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
  }, [gisStatus]);

  // Load GAPI, init, and store client in googleAPI
  const gapiStatus = useLoadScript('https://apis.google.com/js/api.js');
  useEffect(() => {
    if (gapiStatus === 'done') {
      const loadGAPI = async function () {
        // Load and initialize the client
        await new Promise((resolve, reject) => {
          window.gapi.load('client', {callback: resolve, onerror: reject});
        });
        await window.gapi.client.init({});

        setGoogleAPI(window.gapi.client);
      }
      loadGAPI();
    }
  }, [gapiStatus]);

  // Set the token into the GoogleAPI
  useEffect(() => {
    if (googleAPI != null && tokens?.access_token != null) {
      // googleAPI.setToken(tokens.access_token);
      fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events' , {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          Accept: 'application/json'
        }
      }).then(response => console.log(response));
    }
  }, [tokens, googleAPI]);

  // Function for initiating login via GIS
  const login = () => {
    GISClientRef.current.requestCode();
  }

  if (gisStatus !== 'done' || gapiStatus !== 'done') {
    return (<h1>Loading</h1>);
  }

  if (tokens?.access_token == null) {
    return (<button onClick={login}>Login</button>);
  }

  return (
    <div>
      Token: {tokens.access_token}
      {children}
    </div>
  );
}

export default GoogleLoginRequired;