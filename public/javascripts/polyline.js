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

  const url = '/polyline';
  const options = {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    body: JSON.stringify(polylineArrStr)
  };

  fetch(url, options);
}

// LOADING polylines from database on login
function loadPolylines(){
  fetch('/polyline/load', { credentials: 'include' }).then((res) => {
    return res.json();
  }).then((polylines) => {
    console.log(polylines);
    addPolyline(polylines);
  }).catch((err) => {
    console.log(err.message);
  })
}

function addPolyline(polyline){
  polyline.forEach((polyline) => {
    polyline = new google.maps.Polyline({
      path: [google.maps.LatLng(polyline.positionOne.lat, polyline.positionOne.lng), google.maps.LatLng(polyline.positionTwo.lat, polyline.positionTwo.lng)],
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
