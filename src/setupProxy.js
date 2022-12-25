const bodyParser = require('body-parser');
const { exchangeCodeForToken, refreshToken } = require('../lambda/tokenAuth');

const jsonParser = bodyParser.json();

module.exports = function(app) {
  app.post('/auth', jsonParser, (req, res) => {
    if (req.body.action === 'code') {
      exchangeCodeForToken(req.body).then(result => {
        res.send(result);
      });
    } else if (req.body.action === 'refresh') {
      refreshToken(req.body).then(result => {
        res.send(result);
      });
    }
  });
};