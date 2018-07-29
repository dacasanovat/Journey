const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MarkerSchema = new Schema({
  latitude: { type: Number },
  longitude: { type: Number }
});

const Marker = mongoose.model('Marker', MarkerSchema);
module.exports = Marker;
