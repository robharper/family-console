const { google } = require('googleapis');

let _client = null;
const oauthClient = () => {
  if (_client) {
    return _client;
  }
  if (!process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REDIRECT_URL) {
      throw new Error('Must specify Google OAuth environment variables');
    }

  _client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );
  return _client;
}

async function exchangeCodeForToken({code}) {
  try {
    const response = await oauthClient().getToken(code);
    if (response.res?.status === 200) {
      return response.tokens;
    } else {
      console.error('Non 200 response from exchange', response);
      throw new Error('Unable to exchange code for tokens');
    }
  } catch (e) {
    console.error('Exceptions parsing response from exchange', e);
    throw e;
  }
}

async function refreshToken({refresh_token}) {
  try {
    const response = await oauthClient().refreshToken(refresh_token);
    if (response.res?.status === 200) {
      return response.tokens;
    } else {
      console.error('Non 200 response from exchange', response);
      throw new Error('Unable to exchange code for tokens');
    }
  } catch (e) {
    console.error('Exceptions parsing response from exchange', e);
    throw e;
  }
}

module.exports = {
  exchangeCodeForToken,
  refreshToken
};