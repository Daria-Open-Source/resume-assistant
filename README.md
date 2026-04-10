# resume-assistant
A resume analysis tool for RPI students. It takes a resume and query, and provides improvements based on objectives contextualized by resumes from a database. 

===
# Setup
## Prerequisites
- Node.js 18+
- MongoDB Atlas cluster with a `vector-search` index on the `vec` field
- Google service account JSON with Drive API access

## Environment Variables
# `server/.env`
```
DARIA_DB_USER=mongodb+srv://<user>:<password>@<cluster>/
MIXEDBREAD_API_KEY=<your-mixedbread-key>
GROQ_API_KEY=<your-groq-key>
```
# `resume_provider/.env`
```
GOOGLE_APPLICATION_CREDENTIALS=./service_key.json
```
Google service account key at `resume_provider/service_key.json`.

## Run
```
cd server
npm install
node src/index.js
cd ..
cd resume_provider
npm install
node src/index.js
```
===