const express = require('express');
const User = require('../models/user');

const router = express.Router();

// save user
router.post('/', (req, res) => {
  const user = new User(req.body);
  user.save((err) => {
    if(err) console.log(err);
    req.session.userId = user._id;
    req.session.firstName = user.firstName;
    return res.redirect('/');
  });
});

module.exports = router;
