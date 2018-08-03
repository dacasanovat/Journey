// ADD marker to array
function addMarkerToArray(marker){

  // ADD marker to the array
  markerArr.push(marker);

  addPropertiesMarkers(marker);

  console.log('Saved');
  console.log(markerArr)

  // STOP animation
  setInterval(() => {
    marker.setAnimation(null);
  }, 490);

}


// ADD properties to each marker
function addPropertiesMarkers(marker){

  // create polyline between markers
  marker.addListener('dblclick', createPolyline);
  // show infowindow
  marker.addListener('mouseover', (position) => displayInfoMarker(position, marker));
}

// DISPLAY info window from marker
function displayInfoMarker(position, marker){
  infowindowMarker.open(map, marker);
  markerToDelete = marker;
  i = markerArr.indexOf(marker);
}

// DELETE Marker
function deleteMarker(){
  markerToDelete.setMap(null);
  markerArr.splice(i, 1);
  console.log(markerArr);

}

// LOAD markers from database on login
function loadMarkers(){

  // get user id from session, take it and make a request to the backend get only markers asociated with that user.
  fetch('/map/load', { credentials: 'include' }).then((res) => {
    return res.json()

  }).then((markers) => {
    console.log('------markers that loaded-------')
    console.log(markers);
    console.log('--------------------------------')
    addMarkers(markers);

  }).catch((err) => {
    console.log(err.message);
  })

}

// ADD markers from database to map
function addMarkers(markers){
  markers.forEach((marker) => {
    let lat = marker.latitude;
    let lng = marker.longitude;

    marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(lat, lng),
      icon: pinpointIcon
    });

    addPropertiesMarkers(marker);

  });
}

// FETCHING markers positions
function saveMarkers(){
  if(polylineArr.length > 0){
    savePolyline();
  }

  if(markerArr.length > 0){
    const markerArrStr = markerArr.map((marker) => {
      return {
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
      }
    });
    const url = '/map'
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(markerArrStr)
    }
    fetch(url, options);
  }
}
