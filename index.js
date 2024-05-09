//const { fetchISSFlyOverTimes } = require('./iss');
//const { fetchCoordsByIP } = require('./iss');
//const { fetchMyIP } = require('./iss');
const { nextISSTimesForMyLocation } = require('./iss');
/*
fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});
*/

/*
fetchCoordsByIP('162.245.144.188', (error, coordinates) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned coordinates:' , coordinates);
});
*/

/*
fetchISSFlyOverTimes({ latitude: '49.27670', longitude: '-123.13000' }, (error, flyOver) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned fly over times:' , flyOver);
});
*/
const printPassTimes = function(passTimes) { //passTimes function takes an array of objects
  for (const pass of passTimes) { //iterate through the array of objects
    const datetime = new Date(0); //create a new date object
    datetime.setUTCSeconds(pass.risetime); //set the date object to the risetime
    const duration = pass.duration; //get the duration from the object
    console.log(`Next pass at ${datetime} for ${duration} seconds!`); //print the date and duration
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});