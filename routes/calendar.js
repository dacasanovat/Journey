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
    id: req.session.userId
  });
  return new Promise((resolve, reject) => {
    activityList.save((error, result) => {
      if(error) {
        reject(error)
      }
      resolve(result);
    });
  });

  Promise.all(activityList).then((results) => {
    console.log(results);
    console.log('All activities saved');
  }, (error) => {
    console.log(error);
    console.log('we fucked up');
  });
});




module.exports = router;
