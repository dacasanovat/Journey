const mongoose = require('mongoose');
const express = require('express');
const Marker = require('../models/markers');
const User = require('../models/user');

const router = express.Router();

// let userId;

// map page
router.get('/', (req, res) => {
  res.render('map');
  // userId = req.session.userId;
});

router.post('/', (req, res) => {
  // console.log(req.query.long);
  // console.log(req.query.lat);
  console.log('--------------------');

  let markerArrStr = req.body;
  // let markerArrStr = JSON.parse(req.body);

  JSON.parse(markerArrStr);

  console.log(markerArrStr.markers);




  // JSON.parse(markerArrStr);

  const marker = new Marker({
    longitude: req.query.long,
    latitude: req.query.lat,
    id: req.session.userId,
  });

  marker.save()

  // .then((next) => {
  //   return next();
  // })

  // .catch((err) => {
  //   console.log(err.message);
  //   return next();
  // })
});

router.get('/load', (req, res, next) => {
  Marker.find({ id: req.session.userId }).exec((err, markers) => {
    if(err){
      return next(err);
    } else if(!markers) {
      var err = new Error('Marker not found.');
      err.status = 404;
      return next(err);
    }

    return res.json(markers);
  });
});

// function saveToDatabase(marker){
//   const markerWithPosition = new Marker({
//     latitude: marker.getPosition().lat(),
//     longitude: marker.getPosition().lng(),
//     email: User.email
//   });
//
//   console.log(markerWithPosition);
//
//   markerWithPosition.save((err) => {
//       if (err) console.log(err);
//       return res.redirect('/users');
//     });
//
// }

// BACKEND
// router.post("/marker/save", (req, res) => {
//   req.query.lat // = 55
//   req.query.long // = 3156
//   const Marker = new Marker({longitude: req.query.long, latitude: req.query.lat, email: req.session.email});
//
//   Marker.save()
// })

// BACKEND
// router.post('/map', (req, res) => {
//   console.log(req.query.lat); // = 55
//   console.log(req.query.long); // = 3156
//   console.log(req.session.email);
//   const marker = new Marker({
//     longitude: req.query.long,
//     latitude: req.query.lat,
//     email: req.session.email
//   });
//
//   marker.save()
// })

module.exports = router;
