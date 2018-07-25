const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarkerSchema = new Schema({
  map: map,
  icon: icon,
  title: place.name,
  position: place.geometry.location
});

const Marker = mongoose.model('Marker', MarkerSchema);
module.exports = Marker;
