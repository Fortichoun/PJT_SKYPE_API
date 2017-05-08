const User = require('../models/user.js');
const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../services/config.js');

const router = express.Router();

router.post('/', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      res.json({ success: false });
    } else if (user) {
      if (!user.isRightPassword(req.body.password)) {
        res.json({ success: false });
      } else {
        const token = jwt.sign(user, config.get('security:secret'), {
          expiresIn: config.get('security:tokenLife'),
        });
        res.json({
          user,
          success: true,
          token,
        });
      }
    }
  }).catch(err => next(err));
});


module.exports = router;
