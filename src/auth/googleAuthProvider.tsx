import { createContext, useContext } from 'react';
import { GoogleTokens } from './authApi';
import { useAsyncRetry } from 'react-use';
interface GoogleAuth {
  tokens: GoogleTokens | undefined;
  setTokens: (value: GoogleTokens) => void;
  logout: () => void;
}

const GoogleAuthProvider = createContext<GoogleAuth | undefined>(undefined);

/**
 * Pulls the `GoogleAuth` context from a parent
 * @returns
 */
function useGoogleAuth(): GoogleAuth {
  const context = useContext(GoogleAuthProvider)
  if (context == null) {
    throw new Error('useAuth must be used inside a GoogleAuthProvider')
  }
  return context
}


export interface GoogleQueryParams {
  url: string,
  headers?: Record<string, string>
}

/**
 * Makes a query to a url while automatically using the accessToken provided by `useGoogleAuth`
 * @param {url} The URL to request
 * @returns Promise<data>
 */
function useGoogleQuery<T>({url, headers}: GoogleQueryParams) {
  const { tokens } = useGoogleAuth();
  if (tokens == null) {
    throw new Error('useGoogleQuery called without active google auth tokens in place. Ensure this component is wrapped in a GoogleAuthProvider with non-null tokens');
  }

  const authdHeaders = Object.assign({}, headers, {
    Authorization: `Bearer ${tokens.access_token}`
  });

  const {loading, error, value, retry} = useAsyncRetry<T>(async () => {
    const response = await fetch(url, {
      headers: authdHeaders
    });
    const result = await response.json();
    return result
  }, [url, headers, tokens]);

  return {loading, error, value, retry};
}


export {
  GoogleAuthProvider,
  useGoogleAuth,
  useGoogleQuery
}
