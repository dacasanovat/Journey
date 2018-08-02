const mongoose = require('mongoose');
const express = require('express');
const Marker = require('../models/markers');
const User = require('../models/user');

const router = express.Router();

// map page
router.get('/', (req, res) => {
  res.render('map');
});

// SAVE markers to database
router.post('/', (req, res) => {

  if(req.session.userId == undefined){
    console.log('Log in to save your markers');
  }else{
    console.log('--------------------');

    let markerArrStr = req.body;

    const markerArrStrNew = markerArrStr.map(marker => {
      const newMarker = new Marker({
        latitude: marker.lat,
        longitude: marker.lng,
        id: req.session.userId
      });
      return new Promise((resolve, reject) => {
        newMarker.save((error, result) => {
          if (error) {
            reject(error)
          }
          resolve(result);
        })
      })
    });

    Promise.all(markerArrStrNew).then((results) => {
      console.log(results);
      console.log('All markers saved');
    }, (error) => {
      console.log(error);
      console.log('We fucked up')
    })
  }
});


// LOAD markers from database with specific id
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
