const mongoose = require('mongoose');
const express = require('express');
const Polyline = require('../models/polylines');

const router = express.Router();

// SAVE polylines to database
router.post('/', (req, res) => {
  if(req.session.userId == undefined){
    console.log('Login to save your polylines');
    console.log(req.session.userId);
  } else {
    console.log('--------Polylines----------');
    console.log(req.session.userId);

    let polylineArrStr = req.body;

    const polylineArrStrNew = polylineArrStr.map(polyline => {
      const newPolyline = new Polyline({
        positionOne: {
          lat: polyline.positionOne.lat,
          lng: polyline.positionOne.lng
        },
        positionTwo: {
          lat: polyline.positionTwo.lat,
          lng: polyline.positionTwo.lng
        },
        id: req.session.userId
      });
      return new Promise((resolve, reject) => {
        newPolyline.save((error, result) => {
          if(error) {
            reject(error)
          }
          resolve(result);
        });
      });
    });

    Promise.all(polylineArrStrNew).then((results) => {
      console.log(results);
      console.log('All polylines saved');
    }, (error) => {
      console.log(error);
      console.log('We fucked up')
    });
  }
});

router.get('/load', (req, res, next) => {
  Polyline.find({ id: req.session.userId }).exec((err, polylines) => {
    console.log('we are in the back end load');
    if(err){
      return next(err);
    } else if(!polylines){
      const err =  new Error('No polylines were found.');
      err.status = 404;
      return next(err);
    }
    console.log(polylines);
    return res.json(polylines);
  });
});

module.exports = router;
