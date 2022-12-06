import { createContext, useContext } from 'react';
import { GoogleTokens } from './authApi';

interface GoogleAuth {
  tokens: GoogleTokens;
  setTokens: (tokens: GoogleTokens) => void;
  logout: () => void;
}

const GoogleAuthProvider = createContext<GoogleAuth | null>(null);

function useGoogleAuth() {
  const context = useContext(GoogleAuthProvider)
  if (context == null) {
    throw new Error('useAuth must be used inside a GoogleAuthProvider')
  }
  return context
}

export {
  GoogleAuthProvider,
  useGoogleAuth
}
