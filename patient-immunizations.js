const patientdata = require("./epic-patient-data");
const dotenv = require('dotenv').config();
const { Analytics } = require('@segment/analytics-node');


const sendPatientImmunizationsToSegment = async (patientId) => {

  const analytics = new Analytics({ writeKey: process.env.segment_key });

  //Get access token
  const accessToken = await patientdata.getAccessToken();

  //Get patient immunization data from Epic sandbox
  patientImmus = await patientdata.getPatientImmunizations(accessToken, patientId);
  
  //Send recent data for each immunization type that a patient took
  for (var vaccine of patientImmus.entries()) {
    analytics.track({
      userId: patientId,
      event: 'Immunization taken',
      properties: {
        vaccineName: vaccine[0],
        vaccineStatus: vaccine[1].vaccineStatus,
        vaccineDate: vaccine[1].vaccineDate
      }
    });
  }
} 

sendPatientImmunizationsToSegment('eAB3mDIBBcyUKviyzrxsnAw3');
