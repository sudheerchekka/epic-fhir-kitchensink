const jsrsa = require("jsrsasign");
require("dotenv").config();
//Documentation here = https://fhir.epic.com/Documentation?docId=oauth2&section=Creating-JWTs
function getJWTToken() {
  var header = { alg: "RS384", typ: "JWT" };
  // Payload
  /* var tNow = jsrsa.jws.IntDate.get('now');
    console.log("now: " + tNow);
    var tEnd = jsrsa.jws.IntDate.get('now + 1day');*/

  var currentTime = +new Date(); // the current time in milliseconds
  var issuedAtTimeSeconds = currentTime / 1000;
  var expirationTimeSeconds = currentTime / 1000 + 30;

  var payload = {
    iss: process.env.client_id,
    aud: "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
    sub: process.env.client_id,
    jti: "f9eaafba-2e49-11ea-8880-5ce0c5aee679",
    exp: Math.ceil(expirationTimeSeconds),
    iat: Math.ceil(issuedAtTimeSeconds),
  };

  // Sign JWT, password=616161
  var sHeader = JSON.stringify(header);
  var sPayload = JSON.stringify(payload);
  var privateKey = process.env.private_key;

  //var sJWT = jsrsa.jws.JWS.sign("HS256", sHeader, sPayload, "616161");
  var sJWT = jsrsa.jws.JWS.sign(header.alg, sHeader, sPayload, privateKey);

  // console.log("access toke" + response.data.access_token);
  return sJWT;
}

module.exports = { getJWTToken };

//console.log(getJWTToken());
