import { GoogleCode, GoogleTokens } from "../google/types";


export async function exchangeCodeForToken(code: GoogleCode): Promise<GoogleTokens> {
  // Got a code, now exchange for tokens
  const response = await fetch('auth', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'code',
      ...code
    })
  });

  return await response.json();
}


export async function refreshToken(tokens: GoogleTokens): Promise<GoogleTokens> {
  // Got a code, now exchange for tokens
  const response = await fetch('auth', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'refresh',
      ...tokens
    })
  });

  if (response.ok) {
    const newTokens = await response.json();
    return {
      ...tokens,
      ...newTokens
    }
  } else {
    throw Error('Failed to refresh tokens');
  }
}

