

const axios = require('axios');
const fhirjwt = require("./fhirjwt");
const dotenv = require('dotenv').config();

//

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
const getPatientData = async (patientId) => {
  const accessToken = await getAccessToken();
  console.log("patientId: "+ patientId);
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

    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};



const getAppointments = async () => {
  const accessToken = await getAccessToken();
  //const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1cm46b2lkOmZoaXIiLCJjbGllbnRfaWQiOiI4M2ExMjQ5YS05M2U4LTQ4ZDMtODJhNy1hMTdhZDU2ZmJhMWMiLCJlcGljLmVjaSI6InVybjplcGljOk9wZW4uRXBpYy1jdXJyZW50IiwiZXBpYy5tZXRhZGF0YSI6InpGX2owMmJRRjhyeVVjbjVNSjBndFkzQTJCMU5KZUJOS2hJbE5PQ1ZuOHZxT1dqV2E2M04weHBKYmJ3eGdoaEs2NUpUTGtFeXgtUEJvN28zMEdkYVhFV25FMlJHdkhrUjZMd0Y2YlllTXZNcnRaUUNaTktqWjdTVzZIY3RsZEFyIiwiZXBpYy50b2tlbnR5cGUiOiJhY2Nlc3MiLCJleHAiOjE2Nzc2MjIxMTIsImlhdCI6MTY3NzYxODUxMiwiaXNzIjoidXJuOm9pZDpmaGlyIiwianRpIjoiMDU5ODE4OTktMTUzZS00OGU1LTk0N2QtMDMzMTYyMDgyYzJiIiwibmJmIjoxNjc3NjE4NTEyLCJzdWIiOiJldk5wLUtoWXdPT3FBWm4xcFoyZW51QTMifQ.S1RnxArRU0SS13Kt_QHQzVD3RzCwGfE_1PgqlfU4PLO_X10RkdB-TUjz68QSq4IQ-58CErSyzd4iesU3N2aCdcKHST6Mo6NVgoBnLsNFt4RtXdFeRPEUO2baafyblJUP26DAkdXs6dPB5nR0jCHMXRsASarO_qcKgy403U7_v2K4h_br-75Ed5LwCpIy7SzFAitvqF_jqt7fucX8UYiEZZBU_RdCrkes_dTLoM--mWxXLOY2_sA2AwmqxKLegkTErG4z2bpogK7iiFhW4n-PRwcDHSaQM-iiQwF7vP1X7zICtDmY9PeyJVzbXxwOl158RlPotoEq1mczWCdYT6zlMw';
  
  try {
    const response = await instance.get('/api/FHIR/STU3/Appointment?patient=eAB3mDIBBcyUKviyzrxsnAw3', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = [];

    console.log(response.data.entry[0].resource.start);
    console.log(response.data.entry[0].resource.minutesDuration);
    console.log(response.data.entry[0].resource.status);

    console.log(response.data.entry[1].resource.start);
    console.log(response.data.entry[1].resource.minutesDuration);
    console.log(response.data.entry[1].resource.status);

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


getPatientData('eAB3mDIBBcyUKviyzrxsnAw3');
//getAppointments();