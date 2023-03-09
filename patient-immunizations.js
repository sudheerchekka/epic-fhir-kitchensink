const patientdata = require("./epic-patient-data");
const dotenv = require('dotenv').config();
const { Analytics } = require('@segment/analytics-node');


const sendPatientImmunizationsToSegment = async (patientId) => {

  const analytics = new Analytics({ writeKey: process.env.segment_key });

  //Get access token
  const accessToken = await patientdata.getAccessToken();

  //Get patient immunization data from Epic sandbox
  patientImmus = await patientdata.getPatientImmunizations(accessToken, patientId);
  
  console.log("patientImmus : " + patientImmus.entries().length );

  if (patientImmus.entries().length != undefined)
  {
    //Send recent data for each immunization type that a patient took
    /*for (var vaccine of patientImmus.entries()) {
      analytics.track({
        userId: patientId,
        event: 'Immunization taken',
        properties: {
          vaccineName: vaccine[0],
          vaccineStatus: vaccine[1].vaccineStatus,
          vaccineDate: vaccine[1].vaccineDate
        }
      });
    }*/
  } 
  else //send dummy data
  {
    console.log("sending simulated data to Segment")
    analytics.track({
      userId: patientId,
      event: 'Immunization taken',
      properties: {
        vaccineName: "MMR",
        vaccineStatus: "completed",
        vaccineDate: "2021-09-10"
      }
    });
  }
}

//sendPatientImmunizationsToSegment('eAB3mDIBBcyUKviyzrxsnAw3');//Desiree Caroline Powell
//sendPatientImmunizationsToSegment('erXuFYUfucBZaryVksYEcMg3'); //Camila Maria Lopez
sendPatientImmunizationsToSegment('egqBHVfQlt4Bw3XGXoxVxHg3'); //Elijah Davis
