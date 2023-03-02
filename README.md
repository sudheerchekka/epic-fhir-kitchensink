# open.epic.com FHIR sandbox kitchensink

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
