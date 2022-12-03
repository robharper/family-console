const bodyParser = require('body-parser');
const { exchangeCodeForToken } = require('../lambda/tokenAuth');

const jsonParser = bodyParser.json();

module.exports = function(app) {
  app.post('/token', jsonParser, (req, res) => {
    exchangeCodeForToken({code: req.body.code}).then(result => {
      res.send(result);
    });
  });
};