let t;
let cont = 0;

// ADD marker to array
function addMarkerToArray(marker){

  // ADD marker to the array
  markerArr.push(marker);

  $('.saveBtn').removeClass('disabled');

  addPropertiesMarkers(marker);

  console.log('Saved');
  console.log(markerArr)

  // STOP animation
  setInterval(() => {
    marker.setAnimation(null);
  }, 490);

}

function createInfowindowMarker(){

  const infoMarker =
    `
    <form class="row infoForm">

        <div class="input-field">
          <input id="location" type="text" class="validate" placeholder="Current Location">
        </div>

        <div class="input-field">
          <textarea id="extraInfo" class="materialize-textarea" placeholder="Label"></textarea>
        </div>

      <div class="row infowindowBtn">
        <div class="delete">
          <a onclick="deleteMarker()" class="btn-floating btn-medium waves-effect waves-light red deleteMarker"><img class="deleteMarkerImg" src="/images/deleteMarker.png" alt="deleteMarker"></a>
        </div>
        <div class="save">
          <a onclick="saveInfowindow()" id="saveInfoBtn${cont}" class="btn-floating btn btn-medium waves-effect waves-light green"><i class="material-icons">check</i></a>
        </div>
      </div>
    </form>
  `;
  cont++;
  return infowindowMarker = new google.maps.InfoWindow({
    content: infoMarker,
    maxWidth: 300
  });
}


// ADD properties to each marker
function addPropertiesMarkers(marker){

  const infowindowMarker = createInfowindowMarker();

  infowindowArr.push(infowindowMarker);
  console.log('saved to array');
  console.log('------infowindows---------')
  console.log(infowindowArr);
  console.log('--------------------------')

  // create polyline between markers
  marker.addListener('click', createPolyline);
  // show infowindow
  marker.addListener('mouseover', (position) => displayInfoMarker(position, marker, infowindowMarker));
}

// DISPLAY info window from marker
function displayInfoMarker(position, marker, infowindowMarker){
  infowindowMarker.open(map, marker);

  t = infowindowArr.indexOf(infowindowMarker);

  console.log(t);

  for (let i = 0; i < t ; i++) {
    const iw = infowindowArr[i];
    iw.setMap(null);
  }

  for (let i = (t+1); i < infowindowArr.length; i++) {
    const iw = infowindowArr[i];
    iw.setMap(null);
  }

  console.log($('#location').val());
  console.log($('#extraInfo').val());

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

function saveInfowindow(){

  if($('#location').val() || $('#extraInfo').val()){
    console.log('saving data in infowindowMarker');

    const infowindowSave = {
      location: $('#location').val(),
      info: $('#extraInfo').val()
    }

    console.log(infowindowSave);

    const url = '/map/saveInfowindow'
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(infowindowSave)
    }
    fetch(url, options);
    infowindowArr[t].setMap(null);

    const string = "#saveInfoBtn" + t;

    console.log(string);

    $(string).addClass(" disabled");



    // document.getElementById(string).classList.add(" disabled");

  } else {
    console.log('no entered value');
  }
}

// FETCHING markers positions
function saveMarkers(){
  // DISABLE save btn and empty arrays.
  $('.saveBtn').addClass('disabled');

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

  // infowindowArrLong = Arrays.copyOf(infowindowArr, infowindowArr.length);
  // infowindowPolylineLong = Arrays.copyOf(infowindowPolyline, infowindowPolyline.length);

  markerArr = [];
  // infowindowArr = [];
  polylineArr = [];
}
