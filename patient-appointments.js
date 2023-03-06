const patientdata = require("./epic-patient-data");
const dotenv = require('dotenv').config();
const { Analytics } = require('@segment/analytics-node');


const findAndBookAppt = async (patientId) => {

  const analytics = new Analytics({ writeKey: process.env.segment_key });

  const accessToken = await patientdata.getAccessToken();

  var patientApptData = await patientdata.getPatientAppointments(accessToken, patientId);
  var find1stAvailApptSlotVar = await patientdata.find1stAvailApptSlot(accessToken, "2023-03-29T08:15:00Z", "2023-04-02T08:15:00Z");
  console.log("Next available slotId: " + find1stAvailApptSlotVar);
  patientApptData = await patientdata.bookAppointment(accessToken, patientId, find1stAvailApptSlotVar, "booking from node.js backend app");
  patientApptData = await patientdata.getPatientAppointments(accessToken, patientId);

} 

findAndBookAppt('eAB3mDIBBcyUKviyzrxsnAw3');
