
export interface GoogleTokens {
  access_token: string,
  expiry_date: number,
  id_token: string,
  refresh_token: string,
  scope: string,
  token_type: string
}

export interface GoogleCode {
  code: string
}

export async function exchangeCodeForToken(code: GoogleCode): Promise<GoogleTokens> {
  // Got a code, now exchange for tokens
  const response = await fetch('/token', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(code)
  });

  return await response.json();
}


export async function refreshToken(tokens: GoogleTokens): Promise<GoogleTokens> {
  // Got a code, now exchange for tokens
  const response = await fetch('/refresh', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tokens)
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

