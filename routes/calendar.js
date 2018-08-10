const Activity = require('../models/activities.js');
const express = require('express');
const router = express.Router();


router.post('/saveActivities', (req, res) => {
  console.log('---------Activities----------')

  const activityArr = req.body;

  const activityList = new Activity({
    activities: activityArr.act,
    dayId: activityArr.dayId,
    month: activityArr.month,
    year: activityArr.year,
    id: req.session.userId
  });

  Activity.findOneAndUpdate({id: req.session.userId, month: activityArr.month , dayId: activityArr.dayId }, {$set:{activities: activityArr.act}})
    .then((act) => {
      if(!act){
        console.log('not found and creating activity');
        activityList.save();
        console.log(activityList);
      } else {
        console.log('found and updated');
        console.log(act);
      }
    });
});

// LOAD activities
router.post('/load', (req, res, next) => {
  Activity.find({ id: req.session.userId, month: req.body.month, dayId: req.body.day }).exec()
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
