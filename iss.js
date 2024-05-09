/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const needle = require('needle');
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

module.exports = { fetchMyIP };