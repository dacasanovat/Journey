// CREATE POLYLINE
function createPolyline(position){
  count++;
  if(count == 2){
    console.log('drawing line')
    let polyline = new google.maps.Polyline({
      path: [positionOne.latLng, position.latLng],
      map: map,
      strokeWeight: 2,
      geodesic: true,
      icons: [{
        icon: lineSymbol,
        offset: '50%',
        // repeat: '30%'
      }]
    });

    count = 0;
    // ADD polyline to array
    polylineArr.push(polyline);
    console.log(polylineArr);

    // HIDE infowindow
    // polyline.addListener('mouseout', function hideInfoWindowPolyline(){
    //   infowindowPolyline.setMap(null);
    // });
  }
  else{
    console.log('saving position one');
    positionOne = position;
  }

  console.log(polylineArr[0].getPath().getAt(0).lat())


  function displayInfoPolyline(position, polyline){
    infowindowPolyline.setPosition(position.latLng);
    infowindowPolyline.open(map);
    polylineToDelete = polyline;
    i = polylineArr.indexOf(polyline);
  }
}

function addPropertiesPolylines(){
  // SHOW infowindow
  polyline.addListener('click', (position) => displayInfoPolyline(position, polyline));
}

// FETCHING polyline array
function savePolyline(){
  const polylineArrStr = polylineArr.map((polyline) => {
    return {
      positionOne: {
        lat: polyline.getPath().getAt(0).lat(),
        lng: polyline.getPath().getAt(0).lng()
      },
      positionTwo: {
        lat: polyline.getPath().getAt(1).lat(),
        lng: polyline.getPath().getAt(1).lng()
      }
    }
  });

  const url = '/polyline'
  const options = {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    body: JSON.stringify(polylineArrStr)
  }
  fetch(url, options);
}

// LOADING polylines from database on login
function loadPolylines(){
  fetch('/polyline/load', { credentials: 'include' }).then((res) => {
    console.log('We are fetching the polylines front end')
    return res.json();
  }).then((polylines) => {
    console.log(polylines);
    addPolyline(polylines);
  }).catch((err) => {
    console.log(err.message);
  })
}

function addPolyline(polylines){
  polylines.forEach((polyline) => {
    console.log('we are creating each polyline');
    // console.log(polyline.positionOne.lat)
    let LatLngOne = new google.maps.LatLng({ lat: polyline.positionOne.lat, lng: polyline.positionOne.lng });
    let LatLngTwo = new google.maps.LatLng({ lat: polyline.positionTwo.lat, lng: polyline.positionTwo.lng });

    polyline = new google.maps.Polyline({
      path: [ LatLngOne, LatLngTwo ],
      map: map,
      strokeWeight: 2,
      geodesic: true,
      icons: [{
        icon: lineSymbol,
        offset: '50%',
        // repeat: '30%'
      }]
    });

    addPropertiesPolylines(polyline);

  });
}

// DELETE POLYLINE
function deletePolyline(){
  polylineToDelete.setMap(null);
  polylineArr.splice(i, 1);
  console.log(polylineArr);
  infowindowPolyline.setMap(null);
}
