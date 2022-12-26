const {
  exchangeCodeForToken,
  refreshToken
} = require('./tokenAuth.js');

const handler = async(event) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    console.error('Error parsing request', event.body);
    console.error(e);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: e.toString()
      })
    };
  }

  let result;
  let status = 200;
  try {
    switch (body.action) {
      case 'code':
        result = await exchangeCodeForToken(body);
        break;
      case 'refresh':
        result = await refreshToken(body);
        break;
      default:
        result = {error: `'${body.action}' is not valid`};
        status = 400;
    }
  } catch (e) {
    console.error('Error handling request', body);
    console.error(e);
    result = {error: e.toString()}
    status = 400;
  }
  const response = {
      statusCode: status,
      body: JSON.stringify(result),
  };
  return response;
};

module.exports = {
  handler
};
