const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss_promised');

fetchMyIP()
  .then((ip) => fetchCoordsByIP(ip)) //fetchCoordsByIP takes an ip address and returns a promise
  .then((coords) => fetchISSFlyOverTimes(coords)) //fetchISSFlyOverTimes takes coordinates and returns a promise
  .then(body => console.log(body)); //print the body

nextISSTimesForMyLocation() //call the function
  .then((duration) => { //then take the duration
    printPassTimes(duration); //call the printPassTimes function with the duration
  }).catch((error) => {
    console.log("It didn't work: ", error.message);
  });

const printPassTimes = function(passTimes) { //passTimes function takes an array of objects
  for (const pass of passTimes) { //iterate through the array of objects
    const datetime = new Date(0); //create a new date object
    datetime.setUTCSeconds(pass.risetime); //set the date object to the risetime
    const duration = pass.duration; //get the duration from the object
    console.log(`Next pass at ${datetime} for ${duration} seconds!`); //print the date and duration
  }
};
