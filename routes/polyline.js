// SAVE polylines to database
// router.post('/', (req, res) => {
//
//   if(req.session.userId == undefined){
//     console.log('Log in to save your markers');
//   }else{
//     console.log('--------------------');
//
//     let markerArrStr = req.body;
//
//     const markerArrStrNew = markerArrStr.map(marker => {
//       const newMarker = new Marker({
//         latitude: marker.lat,
//         longitude: marker.lng,
//         id: req.session.userId
//       });
//       return new Promise((resolve, reject) => {
//         newMarker.save((error, result) => {
//           if (error) {
//             reject(error)
//           }
//           resolve(result);
//         })
//       })
//     });
//
//     Promise.all(markerArrStrNew).then((results) => {
//       console.log(results);
//       console.log('All markers saved');
//     }, (error) => {
//       console.log(error);
//       console.log('We fucked up')
//     })
//   }
// });
