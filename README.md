# open.epic.com FHIR sandbox kitchensink

This repo is a backend services application using open.epic.com FHIR APIs to push and retrieve data from the Epic sandbox. It uses OAuth 2.0 authentication wnd authorization where a private key is used to sign JSON Web Token (JWT) which is then presented to the open.epic.com authorization server to obtain an access token. The access token is used to invoke the secure FHIR APIs.

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

5. Run the sample code

```bash
node get-appts.js
```
