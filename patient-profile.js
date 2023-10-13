const patientdata = require("./epic-patient-data");
const dotenv = require("dotenv").config();
const { Analytics } = require("@segment/analytics-node");

console.log("**DEBUG** before send patient to segment");
const sendPatientProfileToSegment = async (patientId) => {
  const analytics = new Analytics({ writeKey: process.env.segment_key });
  console.log("**DEBUG** process.env.segment_key " + process.env.segment_key);
  const accessToken = await patientdata.getAccessToken();
  console.log("**DEBUG** accessToken " + accessToken);
  const patientData = await patientdata.getPatientData(accessToken, patientId);

  analytics.identify({
    userId: patientId,
    traits: {
      name: patientData[0].name,
      dob: patientData[0].dob,
    },
  });
};

//sendPatientProfileToSegment('eAB3mDIBBcyUKviyzrxsnAw3'); //Desiree Caroline Powell
//sendPatientProfileToSegment('erXuFYUfucBZaryVksYEcMg3'); //Camila Maria Lopez
sendPatientProfileToSegment("egqBHVfQlt4Bw3XGXoxVxHg3"); //Elijah Davis
//https://fhir.epic.com/Documentation?docId=testpatients -- patient data is here
