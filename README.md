# Resume-Assistant
A resume analysis tool for RPI students. It takes a resume and query, and provides improvements based on objectives contextualized by resumes from a database. 

===
## Setup 
## Prerequisites
- Node.js 18+
- MongoDB Atlas cluster with a `vector-search` index on the `vec` field
- Google service account JSON with Drive API access

## Environment Variables
### `server/.env`
```
DARIA_DB_USER=mongodb+srv://<user>:<password>@<cluster>/
MIXEDBREAD_API_KEY=<your-mixedbread-key>
GROQ_API_KEY=<your-groq-key>
```
### `resume_provider/.env`
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
## Summary of Action
1. User uploads PDF + query
2. PDF turns to Text then Chunked Sections
3. Embed query with MixedBread API
4. Vector search MongoDB Atlas (per section)
5. Groq LLM (llama-3.3-70b) generates JSON feedback
6. Structured recruiter analysis returned to user

===
## Version
v1.0 - 05.01.2026
===
## License
The MIT License (MIT)

Copyright (c) 2015 Chris Kibble

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.