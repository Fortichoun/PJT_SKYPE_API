const User = require('../models/user.js');
const express = require('express');

const router = express.Router();

// GET on /api/contacts
// Search for a user by email
router.get('/', (req, res) => {
  User.findOne({ email: req.query.contactEmail })
        .exec((err, contact) => {
          res.json(contact);
        });
});

// GET on /api/contacts/allContacts
// Give back to the front-end every contacts / friend requests received /
// friend requests sent
router.get('/allContacts', (req, res) => {
  const contactsId = req.query.contacts.map(JSON.parse).map(contact => contact._id);
  User.find({ _id: { $in: contactsId } })
        .exec((err, contacts) => {
          res.json(contacts);
        });
});

// POST on api/contacts
// Handle the friend requests sending
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
