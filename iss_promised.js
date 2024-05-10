const needle = require('needle');

const fetchMyIP = function() {
  return needle('get', 'https://api.ipify.org?format=json').then((response) => {
    const body = response.body;
    const ip = body.ip;
    return ip;
  });
};

/*
 * Makes a request to ipwho.is using the provided IP address to get its geographical information (latitude/longitude)
 * Input: IP address as a string
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = function(ip) {

  return needle('get',`http://ipwho.is/${ip}`).then((response) => {
    const body = response.body;
    const lat = body.latitude;
    const lon = body.longitude;
    const coords = { latitude: lat, longitude: lon };
    return coords;
  });
};

/*
 * Requests data from https://iss-flyover.herokuapp.com using provided lat/long data
 * Input: Body containing geo data response from ipwho.is
 * Returns: Promise of request for fly over data, returned as JSON string
 */
const fetchISSFlyOverTimes = function(coords) {
  return needle('get', `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`).then((response) => {
    const body = response.body;
    const duration = body.response;
    return duration;
  });
};


/*
 * Input: None
 * Returns: Promise for fly over data for users location
 */

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then((ip) => fetchCoordsByIP(ip))
    .then((coords) => fetchISSFlyOverTimes(coords))
    .then((duration) => {
      return duration;
    });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};