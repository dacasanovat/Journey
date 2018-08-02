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

    // SHOW infowindow
    polyline.addListener('click', (position) => displayInfoPolyline(position, polyline));

    // HIDE infowindow
    // polyline.addListener('mouseout', function hideInfoWindowPolyline(){
    //   infowindowPolyline.setMap(null);
    // });
  }
  else{
    console.log('saving position one');
    positionOne = position;
  }


  function displayInfoPolyline(position, polyline){
    infowindowPolyline.setPosition(position.latLng);
    infowindowPolyline.open(map);
    polylineToDelete = polyline;
    i = polylineArr.indexOf(polyline);
  }
}

// DELETE POLYLINE
function deletePolyline(){
  polylineToDelete.setMap(null);
  polylineArr.splice(i, 1);
  console.log(polylineArr);
  infowindowPolyline.setMap(null);
}
