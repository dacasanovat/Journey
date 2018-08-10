let t;
let cont = 0;
let iwInfo;
let iwLocation;
let infowindowLoadArr = [];
let iwLat;
let iwLng;
let latMark;
let lngMark;
let empty = true;
// let idMarkerDB;

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

// function fetchInfowindows(){
//   console.log('fetching');
//   fetch('/map/loadInfowindow', { credentials: 'include' }).then((res) => {
//     return res.json()
//
//   }).then((infowindow) => {
//     console.log('------infowindows that loaded-------')
//     console.log(infowindow);
//     console.log('--------------------------------')
//     console.log('copying');
//     for (let i = 0; i < infowindow.length; i++) {
//       infowindowLoadArr[i] = infowindow[i]
//     }
//     console.log(infowindowLoadArr);
//   }).catch((err) => {
//     console.log(err.message);
//   })
// }

// function copyInfowindowsToArr(infowindow){
//   console.log('copying');
//   for (let i = 0; i < infowindow.length; i++) {
//     infowindowLoadArr[i] = infowindow[i]
//   }
//   console.log(infowindowLoadArr);
// }

function createInfowindowMarker(iwCompared){

  if(empty == true) {
    iwCompared.location = "";
    iwCompared.info = "";
}

  const infoMarker =
    `
    <form class="row infoForm">

        <div class="input-field">
          <input id="location" type="text" class="validate" value="${iwCompared.location}" placeholder="Current Location">
        </div>

        <div class="input-field">
          <textarea id="extraInfo" class="materialize-textarea" placeholder="Label">${iwCompared.info}</textarea>
        </div>

      <div class="row infowindowBtn">
        <div class="delete">
          <a onclick="deleteMarker()" class="btn-floating btn-medium waves-effect waves-light red deleteMarker"><img class="deleteMarkerImg" src="/images/deleteMarker.png" alt="deleteMarker"></a>
        </div>
        <div class="save">
          <a onclick="saveInfowindow()" class="btn-floating btn btn-medium waves-effect waves-light green"><i class="material-icons">check</i></a>
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
  let iwCompared;

  console.log(infowindowLoadArr);

  if(infowindowLoadArr.length > 0){
    console.log('we are comparing markers with infowindows');
    const lat = marker.getPosition().lat();
    const lng = marker.getPosition().lng();

    iwCompared = infowindowLoadArr.find(function(element) {
      if(lat == element.lat && lng == element.lng){
        console.log('we found the one iw');
        return element;
      }
    });
  }

  if(iwCompared == undefined) {
    iwCompared = {
      location: "",
      info: ""
    }
  }

  const infowindowMarker = createInfowindowMarker(iwCompared);


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

  iwLat = marker.getPosition().lat();
  iwLng = marker.getPosition().lng();


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
    let markers;
    // get user id from session, take it and make a request to the backend get only markers asociated with that user.
    fetch('/map/load', { credentials: 'include' }).then((res) => {
      console.log('1')
      return res.json()

    })
    .then((data) => {
      console.log('2')
      markers = data;
    })
    .then(()=> {
      console.log('3')
      return fetch('/map/loadInfowindow', { credentials: 'include' })
    })
    .then((res) => {
      console.log('4')
        return res.json()
    }).then((infowindow) => {
        console.log('5')
        console.log('------infowindows that loaded-------')
        console.log(infowindow);
        console.log('--------------------------------')
        console.log('copying');
        for (let i = 0; i < infowindow.length; i++) {
          infowindowLoadArr[i] = infowindow[i]
        }
        console.log(infowindowLoadArr);
    })
    .then(() => {
      console.log('6')
      console.log('------markers that loaded-------')
      console.log(markers);
      console.log('--------------------------------')
      if(markers.length > 0){
        empty = false;
      }
      addMarkers(markers);

    }).catch((err) => {
      console.log(err.message);
    })

}

// ADD markers from database to map
function addMarkers(markers){

  markers.forEach((marker) => {
    latMark = marker.latitude;
    lngMark = marker.longitude;
    // idMarkerDB = marker._id;

    marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(latMark, lngMark),
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
      info: $('#extraInfo').val(),
      lat: iwLat,
      lng: iwLng
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

    // const string = "#saveInfoBtn" + t;

    // console.log(string);

    // $(string).addClass(" disabled");



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

  markerArr = [];
  polylineArr = [];
}
