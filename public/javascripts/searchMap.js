  // This example adds a search box to a map, using the Google Place Autocomplete
  // feature. People can enter geographical searches. The search box will return a
  // pick list containing a mix of places and predicted search terms.

  // This example requires the Places library. Include the libraries=places
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

  let markerArr = [];
  let polylineArr = [];
  let infowindowArr = [];
  let markers = [];

  let markerToDelete;
  let polylineToDelete;

  let searchMarker;
  let addConfirm = false;
  let lineSymbol;
  // let infowindowMarker;
  let infowindowPolyline;
  let infowindowSearch;
  let pinpointIcon;
  let pinpointIconGrey;
  let drawingMarker;

  // i is the position of the marker in the array
  let i;
  let positionOne;
  let map;


// CREATING MAP
  function initAutocomplete() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40, lng: -30},
      zoom: 3,
      mapTypeId: 'roadmap',
      minZoom: 3
    });

    map.addListener('click', function hideAllInfowindows(){
      for (let i = 0; i < infowindowArr.length; i++) {
        infowindowArr[i].setMap(null);
      }
      infowindowPolyline.setMap(null);
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
          position: place.geometry.location
        });

        searchMarker.addListener('mouseover', function displayInfowindowSearch(){
          infowindowSearch.open(map, searchMarker);
        })

        // addMarkerToArray(searchMarker);

        markers.push(searchMarker);

        const placeName = searchMarker.getTitle();

        let infoSearch =
        `
        <div class="center">
          <legend class="searchLocation">${placeName}</legend>
          <a onclick="addToMap('${placeName}')" class="waves-effect waves-light btn-small addBtn"><i class="material-icons left">add</i>Add to map</a>
        </div>
        `;



        // '<i class="infoSearchIcon btn-small material-icons" onclick="addToMap()">add</i><h6 class="infoSearch">save to map</h6>'

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
        position: google.maps.ControlPosition.LEFT_TOP,
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

    let infoPolyline = '<a onclick="deletePolyline()" class="btn-floating btn btn-medium waves-effect waves-light deletePolyline red"><i class="material-icons">delete</i></a>';

    infowindowPolyline = new google.maps.InfoWindow({
      content: infoPolyline,
    });

    $('.saveBtn').addClass('disabled');

    loadMarkers();
    loadPolylines();

  }

  // ADD searchmarker to array and map
  function addToMap(placeName){

    drawingMarker = new google.maps.Marker({
      map: map,
      position: searchMarker.getPosition(),
      icon: pinpointIcon
    });

    console.log(placeName);

    console.log('addConfirm = true')
    addConfirm = true;
    addMarkerToArray(drawingMarker);

    searchMarker.setMap(null);

    infowindowSearch.setMap(null);

    // const infowindowMarker = createInfowindowMarker(placeName);

    // createInfowindowMarker(placeName).open(map, drawingMarker)

    // infowindowMarker.open(map, drawingMarker);
  }
