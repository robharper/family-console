import { useCallback } from 'react';
import { useGoogleAuth } from "./googleAuthProvider";
import { GoogleTokens, refreshToken } from "./authApi";

export interface GoogleQueryParams {
  url: string,
  headers?: Record<string, string>
}
export type GoogleQueryFunction = (parmas: GoogleQueryParams, tokens: GoogleTokens) => Promise<any>;

export type TokenGetter = () => GoogleTokens | null;
export type TokenSetter = (tokens: GoogleTokens | null) => void;

const EXPIRY_BUFFER_MS = 5*60*1000; // 5 minutes

const refresh = async (old_tokens: GoogleTokens, setTokens: (tokens: GoogleTokens) => void) => {
  if (old_tokens == null) {
    throw new Error('Cannot refresh - missing tokens');
  }
  try {
    const new_tokens = await refreshToken(old_tokens);
    const updated_tokens = {
      ...old_tokens,
      ...new_tokens
    };
    setTokens(updated_tokens);
    return updated_tokens;
  } catch (e) {
    // TODO
    console.error(e);
    throw e;
  }
}

const googleQuery = async ({url, headers} : GoogleQueryParams, tokens: GoogleTokens, setTokens: (tokens: GoogleTokens) => void) => {
  if (tokens?.access_token == null) {
    throw new Error('No access_token provided to googleQuery');
  }

  if (tokens.refresh_token != null && tokens.expiry_date != null && tokens.expiry_date - EXPIRY_BUFFER_MS < Date.now()) {
    // Token refresh needed
    console.log('Tokens are old, refreshing tokens');
    tokens = await refresh(tokens, setTokens);
  }

  headers = Object.assign({}, headers, {
    Authorization: `Bearer ${tokens.access_token}`
  });

  const response = await fetch(url , {
    headers
  });

  if (response.status === 401) {
    const body= await response.json();
    console.log('Receieved 401, refreshing tokens', body);
    await refresh(tokens, setTokens);
  }

  return response;
};


export function useGoogleQuery() {
  const { tokens, setTokens } = useGoogleAuth();
  return useCallback(
    (params : GoogleQueryParams) => googleQuery(params, tokens, setTokens),
    [tokens, setTokens]
  )
}
