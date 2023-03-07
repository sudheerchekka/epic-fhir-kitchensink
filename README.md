# open.epic.com FHIR sandbox kitchensink


This backend application accesses patient data from the Epic sandbox (open.epic.com) using FHIR APIs and sends that patient data to Twilio Segment. Twilio Segment is configired to build various patient audiences and personlized SMS outreach. 

The application uses OAuth 2.0 authentication to access FHIR APIs.  A public key is first pre-registered on open.epic.com and uses the corresponding private key to sign a JSON Web Token (JWT) which is presented to the authoriaztion server to obtain an access token. This access token is used to call FHIR APIs on the Epic sandbox.

![Demo Flow](images/Epic_Sandbox_demo.png "Demo Flow")

### Set up instructions
1. Create Public Private Key Pair
* you can use openssp or similar tools to generate them

2. Create a build app @ open.epic.com
* Select all applicable Incoming APIs
* Upload your public key from previous step
* Select SMART on FHIR veersion. [STU3 for this kitchensink]
* Save & Ready for Sandbox

3. Populate environmant variables 
* Make a copy of .env.example 
```bash
cp .env.example .env
```
* client_id = Enter Non-Production Client ID from your build app from previous step
* private_key = enter the private key from Step 1

4. Install npm dependencies

```bash
npm install on the root folder
```

5. Send patient profile data to Segment

```bash
node patient-profile.js
```

6. Send patient immunization data from Epic sandbox to Segment

```bash
node patient-immunizations.js
```
