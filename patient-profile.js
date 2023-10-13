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
          patient_name: patientData[0].name,
          dob: patientData[0].dob,
        }
      });
}

//sendPatientProfileToSegment('eAB3mDIBBcyUKviyzrxsnAw3'); //Desiree Caroline Powell
//sendPatientProfileToSegment('erXuFYUfucBZaryVksYEcMg3'); //Camila Maria Lopez
sendPatientProfileToSegment('egqBHVfQlt4Bw3XGXoxVxHg3'); //Elijah Davis

//sendPatientProfileToSegment('user011'); //Elijah Davis
