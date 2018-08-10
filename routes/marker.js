const mongoose = require('mongoose');
const express = require('express');
const Marker = require('../models/markers');
const User = require('../models/user');
const Infowindow = require('../models/infowindows');

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
    console.log('---------Markers----------');
    console.log(req.session.userId);

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
        });
      });
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

// SAVE infowindow
router.post('/saveInfowindow', (req, res) => {
  if(req.session.userId == undefined){
    console.log('Log in to save your infowindows');
  }else{
    const infowindow = req.body;

    const newInfowindow = new Infowindow({
      location: infowindow.location,
      info: infowindow.info,
      lat: infowindow.lat,
      lng: infowindow.lng,
      id: req.session.userId
    });

    newInfowindow.save((err) => {
      if(err) console.log(err);
    });

    console.log(newInfowindow);
    console.log('infowindow saved');

  }
})


// LOAD markers from database with specific id
router.get('/load', (req, res, next) => {
  Marker.find({ id: req.session.userId }).exec((err, markers) => {
    if(err){
      return next(err);
    } else if(!markers) {
      const err = new Error('No markers where found.');
      err.status = 404;
      return next(err);
    }
    
    return res.json(markers);
  });
});

router.get('/loadInfowindow', (req, res) => {
  Infowindow.find({ id: req.session.userId }).exec((err, infowindow) => {
    if(err){
      return next(err);
    } else if(!infowindow) {
      const err = new Error('No infowindows where found.');
      err.status = 404;
      return next(err);
    }

    return res.json(infowindow);
  });
});

module.exports = router;
