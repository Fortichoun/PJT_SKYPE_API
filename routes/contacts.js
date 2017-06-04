const User = require('../models/user.js');
const express = require('express');
const co = require('co');

const router = express.Router();

// GET on /api/contacts
// Search for a user by email
router.get('/', (req, res) => {
  co(function* () {
    const user = yield User.findOne({ email: req.query.contactEmail });
    res.json(user);
  });
});

// GET on /api/contacts/allContacts
// Give back to the front-end every contacts / friend requests received /
// friend requests sent
router.get('/allContacts', (req, res) => {
  co(function* () {
    const { query } = req;
    const user = yield User.findOne({ _id: query.user });
    yield User.populate(user, { path: 'friendRequestSent._id friendRequestReceived._id contacts._id' });
    res.json(user);
  });
});

// POST on api/contacts
// Handle the friend requests sending
router.post('/', (req, res) => {
  co(function* () {
    const { body } = req;
    const newUser = yield User.findOne({ _id: body.userId });
    const user = yield User.findOne({ _id: body.contactId });
    if (newUser.friendRequestRefused.map(u => u._id.toString()).indexOf(body.contactId) !== -1) {
      newUser.contacts.push(body.contactId);
      newUser.friendRequestRefused.pull({ _id: body.contactId });
      yield newUser.save();
      user.contacts.push(body.userId);
      user.friendRequestSent.pull({ _id: body.userId });
      yield user.save();
    } else {
      user.friendRequestReceived.push(body.userId);
      yield user.save();
      newUser.friendRequestSent.push(body.contactId);
      yield newUser.save();
    }
    yield User.populate(newUser, { path: 'friendRequestSent._id friendRequestReceived._id contacts._id' });
    res.json(newUser);
  });
});

// POST on api/contacts/accept
// Handle the friend requests acceptance
router.post('/accept', (req, res) => {
  co(function* () {
    const { body } = req;
    const user = yield User.findOne({ _id: body.invitationId });
    user.friendRequestSent.pull({ _id: body.userId });
    user.contacts.push(body.userId);
    yield user.save();
    const newUser = yield User.findOne({ _id: body.userId });
    newUser.friendRequestReceived.pull({ _id: body.invitationId });
    newUser.contacts.push(body.invitationId);
    yield newUser.save();
    yield User.populate(newUser, { path: 'friendRequestSent._id friendRequestReceived._id contacts._id' });
    res.json(newUser);
  });
});

// POST on api/contacts/refuse
// Handle the friend requests refuse
router.post('/refuse', (req, res) => {
  co(function* () {
    const { body } = req;
    const user = yield User.findOne({ _id: body.userId });
    user.friendRequestReceived.pull({ _id: body.invitationId });
    user.friendRequestRefused.push(body.invitationId);
    yield user.save();
    yield User.populate(user, { path: 'friendRequestSent._id friendRequestReceived._id contacts._id' });
    res.json(user);
  });
});

// POST on api/contacts/remove
// Handle the remove of a friend
router.post('/remove', (req, res) => {
  co(function* () {
    const { body } = req;
    const contact = yield User.findOne({ _id: body.contactId });
    contact.contacts.pull({ _id: body.userId });
    yield contact.save();
    const user = yield User.findOne({ _id: body.userId });
    user.contacts.pull({ _id: body.contactId });
    yield user.save();
    yield User.populate(user, { path: 'friendRequestSent._id friendRequestReceived._id contacts._id' });
    res.json(user);
  });
});


module.exports = router;
