const Activity = require('../models/activities.js');
const express = require('express');
const router = express.Router();


router.post('/saveActivites', (req, res) => {
  console.log('---------Activities----------')

  const activityArr = req.body;

  const activityList = new Activity({
    activities: activityArr.act,
    dayId: activityArr.dayId,
    month: activityArr.month,
    year: activityArr.year,
    id: req.session.userId
  });

    activityList.save();
});

// LOAD activities
router.get('/load', (req, res, next) => {
  Activity.find({ id: req.session.userId }).exec()
    .then((activities) => {
      if(!activities) {
        const err = new Error('No activities where found.');
        err.status = 404;
        return next(err);
      }
      return res.json(activities);
    }).catch((err) => {
        return next(err);
    });
});

module.exports = router;
