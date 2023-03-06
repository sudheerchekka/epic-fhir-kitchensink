const patientdata = require("./epic-patient-data");
const dotenv = require('dotenv').config();
const { Analytics } = require('@segment/analytics-node');


const sendPatientProfileToSegment = async (patientId) => {

  const analytics = new Analytics({ writeKey: process.env.segment_key });

  const accessToken = await patientdata.getAccessToken();
  const patientData = await patientdata.getPatientData(accessToken, patientId);

  analytics.identify({
        userId: patientId,
        traits: {
          name: patientData[0].name,
          dob: patientData[0].dob,
        }
      });
}

sendPatientProfileToSegment('eAB3mDIBBcyUKviyzrxsnAw3');
