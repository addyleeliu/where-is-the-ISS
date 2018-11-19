$(function(){
  console.log('scripts loaded!');

  var issURL = "http://api.open-notify.org/iss-now.json"; // url for space station coordinates
  var geoURL = ''; // url for reverse geocoding with JSON data
  var issData = [];
  var geoData = [];
  var lat = ''; // latitude
  var lon = ''; // longitude
  var logHtml = '';
  var currHtml = '';
  var msg = ''; // error and complete messages

  updateLocation();
  setInterval(updateLocation, 5000); // Update the location every 5 seconds

  function updateLocation() {
    var time = new Date(); // Get time and date information
    $.ajax({
      type: 'GET',
      url: issURL,
      data: issData,
      dataType: 'json',
      async: true,
      success: function(issData) {
        console.log(issData);
        // Get the space station coordinates from the space station API
        lat = issData.iss_position.latitude;
        lon = issData.iss_position.longitude;
        console.log('ISS latitude: ' + lat + '; longitude: ' + lon);

        /* Pass space station coordinates into the endpoint URL for the second
        API request to the geocoding API */
        geoURL = "https://nominatim.openstreetmap.org/reverse?format=json&lat="
          + lat + '&lon=' + lon;

        $.ajax({
          type: 'GET',
          url: geoURL,
          data: geoData,
          dataType: 'json',
          async: true,
          success: function(geoData) {
            console.log(geoData);
            logHtml += '<p>' + time + ': ' + 'The space station is currently ';
            /* Use reverse geocoding to get the names of the city and country
            that correspond to the space station coordinates */
            if (geoURL = geoData.error) { // If the geocoding API throws an error
              logHtml += 'over an ocean.</p>';
            } else {
              if(geoData.address.city != null) {
                logHtml += 'over ' + geoData.address.city + ', '
                  + geoData.address.country + '</p>';
              }
              else {
                logHtml += 'over ' + geoData.address.state + ', '
                  + geoData.address.country + '</p>';
              }
            }
            document.getElementById("log").innerHTML = logHtml;
            document.getElementById("current").innerHTML = currHtml;

          },
          error: function(msg) {
            console.log('Geocoding data did not load!');
          },
          complete: function(msg) {
            console.log('Geocoding AJAX request finished!');
          }
        }) // END OF GEOCODING AJAX CALL


      },
      error: function(msg) {
        console.log('ISS data did not load!');
      },
      complete: function(msg) {
        console.log('ISS AJAX request finished!');
      }
    }) // END OF ISS AJAX CALL
  }

});
