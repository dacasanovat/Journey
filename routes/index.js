const express = require('express');
const User = require('../models/user');
const Marker = require('../models/markers');
const router = express.Router();

router.use((req, res, next) => {
  res.locals.currentUserId = req.session.userId;
  res.locals.currentName = req.session.firstName;
  next();
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

// get user first name
router.get('/login', (req, res) => {
  User.find({}, 'firstName', (err, users) => {
    if (err) {
      console.error(err);
    } else {
      res.render('index', { users });
    }
  });
});

// calendar page
router.get('/calendar', (req, res) => {
  res.render('calendar');
})

router.post('/login', (req, res, next) => {
  User.authenticate(req.body.emailL, req.body.passwordL, (err, user) => {

    if(err || !user) {
      const nextError = new Error('Username or password incorrect');
      nextError.status = 401;

      return next(nextError);
    }

    console.log('saved the user id')
    req.session.userId = user._id;
    req.session.firstName = user.firstName;
    console.log(user.firstName);

    console.log(req.session.userId);

    return res.redirect('/');
  });
});

// IT DOESENT RETURN A PROMISE?
// router.get('/logout', (req, res, next) => {
//     req.session.destroy().then(() => {
//       return res.redirect('/');
//
//     }).catch((err) => {
//       console.log(err.message);
//       return next(err);
//     });
// });

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err);
      return next();
    });
  }

  return res.redirect('/');
});

// router.get('/logout', (req, res, next) => {
//   if(req.session){
//     req.session.destroy((err) => {
//       if(err) return next(err);
//     });
//   }
//   return res.redirect('/');
// });

module.exports = router;
