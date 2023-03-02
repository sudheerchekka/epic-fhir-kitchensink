

const axios = require('axios');
const fhirjwt = require("./fhirjwt");
const dotenv = require('dotenv').config();

var reuseAccessToken = "";

const instance = axios.create({
  baseURL: 'https://fhir.epic.com/interconnect-fhir-oauth',
  // baseURL: process.env.fhir_sandbox_base_url
});


const getAccessToken = async () => {
  
  console.log("Creating JWTToken...");
  var jwttoken = fhirjwt.getJWTToken();

  console.log("Creating Access Token...");
  const response = await instance.post('/oauth2/token', 
  {
    grant_type: 'client_credentials',
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: jwttoken,
  },
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  console.log("access token: " + response.data.access_token);
  return response.data.access_token;

};




//Get patient data by FHIR Id
const getPatientData = async (accessToken, patientId) => {
  //const accessToken = await getAccessToken();
  //console.log("patientId: "+ patientId);
  try {

    //https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/DSTU2/Patient?identifier=203714 (get patient by MRN ID)
    const response = await instance.get('/api/FHIR/DSTU2/Patient/' + patientId, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = [];

    var name =  response.data.name[0].text;
    var phone = response.data.telecom[0].value;
    var dob = response.data.birthDate;


    data.push({
      name,
      phone,
      dob});

    console.log("Patient data: ");
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};



const getAppointments = async (accessToken, patientId) => {
  //const accessToken = await getAccessToken();
  
  try {
    const response = await instance.get('/api/FHIR/STU3/Appointment?patient=' + patientId, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = [];

    console.log("Patient appointment data: ");
    for(var i = 0; i < response.data.entry.length; i++)
    {
        console.log(response.data.entry[i].resource.start + " :status: " + response.data.entry[i].resource.status);
    }
    

    /*console.log("Name:" + response.data.name[0].text);
    console.log("Phone: " + response.data.telecom[0].value);
    console.log("DoB: " + response.data.birthDate);*/

    /*var name =  response.data.name[0].text;
    var phone = response.data.telecom[0].value;
    var dob = response.data.birthDate;


    data.push({
      name,
      phone,
      dob});

    console.log(data);*/
    return data;
  } catch (error) {
    throw error;
  }
};


const find1stAvailApptSlot = async (accessToken, startTime, endTime) => {
  //var accessToken = await getAccessToken();
  //reuseAccessToken = accessToken;
  //console.log("setting reuseAccessToken: " + reuseAccessToken);
  
  try {
    const response = await instance.post('/api/FHIR/STU3/Appointment/$find', 
    {
      "resourceType": "Parameters",
      "parameter": [
          {
              "name": "startTime",
              //"valueDateTime": "2023-03-22T08:15:00Z"
              "valueDateTime": startTime
          },
          {
              "name": "endTime",
              //"valueDateTime": "2023-04-02T08:15:00Z"
              "valueDateTime": endTime
          },
          {
              "name": "ServiceType",
              "valueCodeableConcept": {
                  "coding": [
                      {
                          "system": "urn:oid:1.2.840.114350.1.13.861.1.7.3.808267.11",
                          "code": "40111223"
                      }
                  ]
              }
          }
      ]
  },
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = [];

  console.log("Available apppointment slots: ");
  for(var i = 0; i < response.data.entry.length; i++)
  {
      console.log(response.data.entry[i].resource.id + " :start: " + response.data.entry[i].resource.start);
  }

  console.log("1st available slot @ " + response.data.entry[0].resource.start + ": " + response.data.entry[0].resource.id);
  return response.data.entry[0].resource.id;

  } catch (error) {
  throw error;
  }
};


const bookAppointment = async (accessToken, patientId, appointmentId, appointmentNote) => {
  
  try {
    const response = await instance.post('/api/FHIR/STU3/Appointment/$book', 
    {
      "resourceType": "Parameters",   
      "parameter": 
      [
        {
        "name": "patient",
        "valueIdentifier": {"value": patientId}
        },
        {
        "name": "appointment",
        "valueIdentifier": {"value": appointmentId}
        },
        {
        "name": "appointmentNote",
        "valueString": appointmentNote
        }
      ]
  },
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = [];

  console.log("Appointment booking status: " + response.data.entry[0].resource.status);
  //return response.data.entry[0].resource.id;
  } catch (error) {
  throw error;
  }
};

const findAndBookSlot = async (patientId) => {
  const accessToken = await getAccessToken();
  getPatientData(accessToken, patientId);
  getAppointments(accessToken, patientId);
  var find1stAvailApptSlotVar = await find1stAvailApptSlot(accessToken, "2023-03-29T08:15:00Z", "2023-04-02T08:15:00Z");
  console.log("Next available slotId: " + find1stAvailApptSlotVar);
  bookAppointment(accessToken, patientId, find1stAvailApptSlotVar, "booking from node.js backend app");
  getAppointments(accessToken, patientId);

} 

findAndBookSlot('eAB3mDIBBcyUKviyzrxsnAw3');
