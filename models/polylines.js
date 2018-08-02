const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PolylineSchema = new Schema({
  positionOne: {
    lat: { type: Number },
    lng: { type: Number }
  },
  positionTwo: {
    lat: { type: Number },
    lng: { type: Number }
  },
  id: { type: String }
});

const Polyline = mongoose.model('Polyline', PolylineSchema);
module.exports = Polyline;
