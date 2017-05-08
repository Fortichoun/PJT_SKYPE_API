const jwt = require('jsonwebtoken');
const config = require('../services/config.js');

module.exports = function (req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
  if (token) {
            // verifies secret and checks exp
    jwt.verify(token, config.get('security:secret'), (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      }
                    // if everything is good, save to request for use in other routes
      req.decoded = decoded;
      return next();
    });
  }
  return res.status(403).send({
    success: false,
    message: 'No token provided.',
  });
};

