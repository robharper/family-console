const bodyParser = require('body-parser');
const { exchangeCodeForToken, refreshToken } = require('../lambda/tokenAuth');

const jsonParser = bodyParser.json();

module.exports = function(app) {
  app.post('/token', jsonParser, (req, res) => {
    exchangeCodeForToken(req.body).then(result => {
      res.send(result);
    });
  });

  app.post('/refresh', jsonParser, (req, res) => {
    refreshToken(req.body).then(result => {
      res.send(result);
    });
  });
};