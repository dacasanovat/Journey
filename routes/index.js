const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.currentUserId = req.session.userId;
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// get user first name
router.get('/login', (req, res) => {
  User.find({}, 'firstName', (err, users) => {
     console.log('HOLA=====')
    if (err) {
      console.error(err);
    } else {
      res.render('index', { users });
    }
  });
});

// map page
router.get('/map', (req, res) => {
  res.render('map');
});

router.post('/login', (req, res, next) => {
  User.authenticate(req.body.emailL, req.body.passwordL, (err, user) => {

    if(err || !user) {
      const nextError = new Error('Username or password incorrect');
      nextError.status = 401;

      return next(nextError);
    }

    req.session.userId = user._id;

    return res.redirect('/');
  });
});

router.get('/logout', (req, res, next) => {
  if(req.session){
    req.session.destroy((err) => {
      if(err) return next(err);
      return next();
    });
  }
  return res.redirect('/');
});

module.exports = router;
