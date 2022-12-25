const {
  exchangeCodeForToken,
  refreshToken
} = require('./tokenAuth.js');

const handler = async(event) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: e.toString()
      })
    };
  }

  let result;
  let status = 200;
  switch (body.action) {
    case 'code':
      try {
        result = await exchangeCodeForToken(body);
      } catch (e) {
        result = {error: e.toString()}
        status = 400;
      }
      break;
    case 'refresh':
      try {
        result = await refreshToken(body);
      } catch (e) {
        result = {error: e.toString()}
        status = 400;
      }
      break;
    default:
      result = {error: `'${body.action}' is not valid`};
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
