const User = require('../models/user.js');
const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
  User.findOne({ email: req.query.contactEmail })
        .exec((err, contact) => {
          res.json(contact);
        });
});
router.post('/', (req, res, next) => {
  const { body } = req;
  User.findOne({ _id: body.userId })
        .exec((err, user) => {
          user.friendRequestSent.push(body.contactId);
          user.save((error, userUpdated) => {
            res.json(userUpdated);
          });
        }).catch(err => next(err));
});

module.exports = router;
