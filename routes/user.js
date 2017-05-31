const User = require('../models/user.js');
const express = require('express');
const co = require('co');


const router = express.Router();

router.post('/', (req, res) => {
  co(function* () {
    const { body } = req;
    const user = yield User.findOne({ _id: body.userId });
    user.userName = body.newUserName;
    user.bio = body.newBio;
    yield user.save();
    res.json(user);
  });
});

module.exports = router;
