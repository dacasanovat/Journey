const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const InfowindowSchema = new Schema({
  location: { type: String },
  info: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  id: { type: String }
});

const Infowindow = mongoose.model('Infowindow', InfowindowSchema);
module.exports = Infowindow;
