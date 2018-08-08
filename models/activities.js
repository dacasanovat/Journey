let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let activitySchema = new Schema({
  activities: [{ type: String }],
  dayId: { type: String },
  month: { type: String },
  year: { type: String },
  id: { type: String }
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
