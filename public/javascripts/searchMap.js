  // This example adds a search box to a map, using the Google Place Autocomplete
  // feature. People can enter geographical searches. The search box will return a
  // pick list containing a mix of places and predicted search terms.

  // This example requires the Places library. Include the libraries=places
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

  let markerArr = [];
  let polylineArr = [];
  let markers = [];
  let markerToDelete;
  let polylineToDelete;
  let searchMarker;
  let addConfirm = false;
  let lineSymbol;
  let infowindowMarker;
  let infowindowPolyline;
  let infowindowSearch;
  let pinpointIcon;
  let pinpointIconGrey;
  let drawingMarker;

  // i is the position of the marker in the array
  let i;
  let count = 0;
  let positionOne;
  let map;



  function initAutocomplete() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40, lng: -30},
      zoom: 3,
      mapTypeId: 'roadmap',
      minZoom: 3
    });

    map.addListener('click', function hideAllInfowindows(){
      infowindowMarker.setMap(null);
      infowindowSearch.setMap(null);
    });

    // CREATE the search box and link it to the UI element.
    let input = document.getElementById('pac-input');
    let searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      let places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }


      // CLEAR out the search marker.
      if(!addConfirm){
        markers.forEach(function(marker) {
          searchMarker.setMap(null);
        });
        i = markerArr.indexOf(searchMarker);
        markerArr.splice(i, 1);
      }

      // ADDCONFIRM variable to false
      addConfirm = false

      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        // CREATE a marker for each place.
        searchMarker = new google.maps.Marker({
          map: map,
          icon: pinpointIconGrey,
          title: place.name,
          position: place.geometry.location,
        });

        searchMarker.addListener('click', function displayInfowindowSearch(){
          infowindowSearch.open(map, searchMarker);
        })

        // addMarkerToArray(searchMarker);

        markers.push(searchMarker);

        let infoSearch = '<i class="infoSearchIcon btn-small material-icons" onclick="addToMap()">add</i><h6 class="infoSearch">save to map</h6>'

        infowindowSearch = new google.maps.InfoWindow({
          content: infoSearch
        });

        infowindowSearch.open(map, searchMarker);

        // markers.push(new google.maps.Marker({
        //   map: map,
        //   icon: pinpointIcon,
        //   title: place.name,
        //   position: place.geometry.location
        // }));



        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    // ICON
    pinpointIcon = {
      url: '/images/placeholder-point-red.png',
      scaledSize: new google.maps.Size(25, 25)
    }
    pinpointIconGrey = {
      url: '/images/placeholder-point-grey.png',
      scaledSize: new google.maps.Size(25, 25)
    }

    // DRAW on map
    var drawingManager = new google.maps.drawing.DrawingManager();

    drawingManager.setOptions({
      drawingControlOptions: {
        map: map,
        position: google.maps.ControlPosition.RIGHT_CENTER,
        drawingModes: ['marker']
      },
      markerOptions:{
        // draggable: true,
        // crossOnDrag: true,
        animation: google.maps.Animation.BOUNCE,
        clickable: true,
        icon: pinpointIcon
      },
      polylineOptions:{
        editable: true
      }

    });

    // DISPLAY on map
    drawingManager.setMap(map);

    // ADD listener when the marker is drawn
    drawingManager.addListener('markercomplete', addMarkerToArray);


    lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
    };

  }

  // ADD marker to array and database
  function addMarkerToArray(marker){

    // import {saveToDatabase} from '.../models/markers';

    // saveToDatabase(marker);

    // marker.addListener('mouseover', attractPolyline);

    // ADD marker to the array
    markerArr.push(marker);

    // CREATE polyline between markers
    marker.addListener('dblclick', createPolyline);


    // SHOW infowindow
    marker.addListener('mouseover', (position) => displayInfoMarker(position, marker));

    // HIDE infowindow
    // marker.addListener('mouseout', function hideInfoWindowMarker(){
    //   infowindowMarker.setMap(null);
    // });

    console.log('Saved');
    console.log(markerArr)

    // Stop animation
    setInterval(() => {
      marker.setAnimation(null);
    }, 490);

    let infoMarker = '<button onclick="deleteMarker()" type="button" name="button"><i class="material-icons">delete</i></button>';

    // CREATE infowindow
    infowindowMarker = new google.maps.InfoWindow({
      content: infoMarker
    });


    function displayInfoMarker(position, marker){
      infowindowMarker.open(map, marker);
      markerToDelete = marker;
      i = markerArr.indexOf(marker);
    }
  }

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
      polyline.addListener('mouseover', (position) => displayInfoPolyline(position, polyline));

      // HIDE infowindow
      polyline.addListener('mouseout', function hideInfoWindowPolyline(){
        infowindowPolyline.setMap(null);
      });
    }
    else{
      console.log('saving position one');
      positionOne = position;
    }

    let infoPolyline = '<button onclick="deletePolyline()" type="button" name="button"><i class="material-icons">delete</i></button>';

    infowindowPolyline = new google.maps.InfoWindow({
      content: infoPolyline
    })

    function displayInfoPolyline(position, polyline){
      infowindowPolyline.setPosition(position.latLng);
      infowindowPolyline.open(map);
      polylineToDelete = polyline;
      i = polylineArr.indexOf(polyline);
    }
  }

  function addToMap(){

    drawingMarker = new google.maps.Marker({
      map: map,
      position: searchMarker.getPosition(),
      icon: pinpointIcon
    });

    console.log('addConfirm = true')
    addConfirm = true;
    addMarkerToArray(drawingMarker);

    searchMarker.setMap(null);

    infowindowSearch.setMap(null);
    infowindowMarker.open(map, drawingMarker);
  }


  function deletePolyline(){
    polylineToDelete.setMap(null);
    polylineArr.splice(i, 1);
    console.log(polylineArr);
    infowindowPolyline.setMap(null);
  }

  function deleteMarker(){
    markerToDelete.setMap(null);
    markerArr.splice(i, 1);
    console.log(markerArr);

  }
