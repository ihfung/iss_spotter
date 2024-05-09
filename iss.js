/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const needle = require('needle');

const fetchCoordsByIP = function(ip, callback) {
  //In the function, make the request to the API, and have it pass back the relevant (lat/lng) data as an object via callback.
  needle.get(`http://ipwho.is/${ip}`, (error, response, body) => {
  //make a get request to the ipwhois API
  //response is doing the same thing which is the response from the API
    // inside the request callback ...
    if (error) {
      callback(error, null); //pass the error to the callback function
      return;
    }
    if (!body.success) { //if the success status is false in the object from the API
      const msg = `Success status was ${body.success}. Server message says: ${body.message} when fetching for IP ${body.ip}`;
      callback(Error(msg), null);
      return;
    }

    const lat = body.latitude; //get the latitude from the object (body)
    const lon = body.longitude; //get the longitude from the object (body)
    const coords = { latitude: lat, longitude: lon }; //create an object with the latitude and longitude
    callback(null, coords); //pass the object to the callback function
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  // ...
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  //make a get request to the iss-flyover API with the latitude and longitude
  needle.get(url, (error, response, body) => { //make a get request to the iss-flyover API
    if (error) {
      callback(error, null); //pass the error to the callback function
      return;
    }
    if (response.statusCode !== 200) { //if the status code is not 200
      const msg = `Status Code ${response.statusCode} when fetching ISS fly over times. Response: ${body}`;
      callback(Error(msg), null); //pass the error to the callback function
      return;
    }
    const flyOver = body.response; //get the response from the object (body) which is an array of objects
    callback(null, flyOver);
  });
};

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API


  needle.get('https://api.ipify.org?format=json', function(error, response, body) { //make a get request to the ipify API
    // inside the request callback ...
  // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null); //pass the error to the callback function
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // if we get here, all's well and we got the data
    const ipAdress = body.ip; //get the ip address from the object (body)
    callback(null, ipAdress); //pass the ip address to the callback function
  });

};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  // empty for now
  fetchMyIP((error, ip) => { //fetch the ip address
    if (error) {
      return callback(error, null); //pass the error to the callback function
    }

    fetchCoordsByIP(ip, (error, coords) => { //fetch the coordinates
      if (error) {
        return callback(error, null); //pass the error to the callback function
      }

      fetchISSFlyOverTimes(coords, (error, flyOver) => { //fetch the fly over times
        if (error) {
          return callback(error, null); //pass the error to the callback function
        }

        callback(null, flyOver); //pass the fly over times to the callback function
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP ,fetchISSFlyOverTimes, nextISSTimesForMyLocation };