const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PolylineSchema = new Schema({
  
})

const Polyline = mongoose.model('Polyline', PolylineSchema);
module.exports = Polyline;
