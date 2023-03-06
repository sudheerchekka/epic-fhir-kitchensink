

const axios = require('axios');
const fhirjwt = require("./fhirjwt");
const dotenv = require('dotenv').config();
const { Analytics } = require('@segment/analytics-node');

var reuseAccessToken = "";

const instance = axios.create({
  baseURL: 'https://fhir.epic.com/interconnect-fhir-oauth',
  // baseURL: process.env.fhir_sandbox_base_url
});


async function getAccessToken() {
  
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
async function getPatientData (accessToken, patientId)  {
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

//https://hostname/instance/api/FHIR/DSTU2/Immunization?patient=TGwyi7uWQngTh8wlsxLyWPi6.8wgRuUnMqMfRuwJhsFkB
async function getPatientImmunizations(accessToken, patientId) {
  
  try {
    const response = await instance.get('/api/FHIR/DSTU2/Immunization?patient=' + patientId, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = new Map();

    console.log("patient-adta: Patient immunization data: ");
    for(var i = 0; i < response.data.entry.length; i++)
    {
        console.log(response.data.entry[i].resource.vaccineCode.text + " :status: " + response.data.entry[i].resource.status + " on: " + response.data.entry[i].resource.date);

        var vaccineName = response.data.entry[i].resource.vaccineCode.text;
        var vaccineStatus = response.data.entry[i].resource.status;
        var vaccineDate = response.data.entry[i].resource.date;

        //adding only the recent immunization details for each vaccine type to the Map
        data.set(
          vaccineName,
          {
            vaccineStatus,
            vaccineDate
          }
        );
    }

    console.log(data);
    
    return data;
  } catch (error) {
    throw error;
  }
};




async function getPatientAppointments(accessToken, patientId) {
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


async function find1stAvailApptSlot(accessToken, startTime, endTime) {
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


async function  bookAppointment (accessToken, patientId, appointmentId, appointmentNote) {
  
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


const patientKitchensink = async (patientId) => {

  const analytics = new Analytics({ writeKey: process.env.segment_key });

  const accessToken = await getAccessToken();
  /*const patientData = await getPatientData(accessToken, patientId);

  analytics.identify({
        userId: patientId,
        traits: {
          name: patientData[0].name,
          dob: patientData[0].dob,
        }
      });*/

  patientImmus = await getPatientImmunizations(accessToken, patientId);
  
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


  /*getAppointments(accessToken, patientId);
  var find1stAvailApptSlotVar = await find1stAvailApptSlot(accessToken, "2023-03-29T08:15:00Z", "2023-04-02T08:15:00Z");
  console.log("Next available slotId: " + find1stAvailApptSlotVar);
  bookAppointment(accessToken, patientId, find1stAvailApptSlotVar, "booking from node.js backend app");
  getAppointments(accessToken, patientId);*/

  
} 

module.exports = { getAccessToken, getPatientData, getPatientAppointments, find1stAvailApptSlot, bookAppointment, getPatientImmunizations  }