const express = require('express');
const User = require('../models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', (req, res) => {
  const user = new User(req.body);
  user.save((err) => {
    if(err) console.log(err);
    return res.redirect('/');
  });
});

module.exports = router;
