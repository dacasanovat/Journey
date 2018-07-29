const Marker = require('../models/markers');


export function saveToDatabase(marker){
  let lat;
  let lng;

  lat = marker.getPosition().lat();
  lng = marker.getPosition().lng();

  const markerWithPosition = new Marker();

  console.log(markerWithPosition);

  markerWithPosition.latitude = lat;
  markerWithPosition.longitude = lng;

  markerWithPosition.save((err) => {
      if (err) console.log(err);
      return res.redirect('/users');
    });

}
