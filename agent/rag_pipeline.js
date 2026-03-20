//Import path/env/pdf parser
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { extractText } = require('unpdf');

//Import services
const Embedder = require('./embedding_service');
const { LLM } = require('./llm_service');

const VectorStore = {
    async queryDocuments(vectorizedQuery) {
        return null;
    },

    async rankFromQuery(vectorizedQuery, documents) {
        return null;
    }
};

//Loads resume from data folder
const loadResumeFromData = async (filename = null) => {
    const dataDir = path.join(__dirname, 'data');

    if (!fs.existsSync(dataDir)) {
        throw new Error(`No /data folder found at ${dataDir}`);
    }

    if (!filename) {
        const pdfs = fs.readdirSync(dataDir).filter(f => f.endsWith('.pdf'));
        if (!pdfs.length) {
            throw new Error('No PDF files found in /data folder');
        }
        filename = pdfs[0];
        console.log(`Auto-detected resume: ${filename}`);
    }

    const pdfPath = path.join(dataDir, filename);

    if (!fs.existsSync(pdfPath)) {
        throw new Error(`Resume not found: ${pdfPath}`);
    }

    const buffer = new Uint8Array(fs.readFileSync(pdfPath));
    const { text } = await extractText(buffer, { mergePages: true });

    if (!text.trim()) {
        throw new Error('PDF was found but no text could be extracted.');
    }

    return text.trim();
};

const ragQuery = async (userQuery) => {
    /*
        1. embed the query
        2. get similar documents (cosine similarity)
        3. rank similar documents
        4. inject documents into prompt
        5. inject user query into prompt
        6. run through LLM
    */
    
    //Vectorize the query
    const vectorizedQuery = await Embedder.vectorize(userQuery);

    //Use query/documents
    const documents = await VectorStore.queryDocuments(vectorizedQuery);
    const bestDocs  = await VectorStore.rankFromQuery(vectorizedQuery, documents);

    //Prepare connection to LLM
    const llm = new LLM();
    const ready = llm.preparePrompt();
    if (!ready) throw new Error('Could not establish connection to the LLM');

    //Inject query and best docs
    llm.injectUserQuery(userQuery);
    llm.injectDocuments(bestDocs);

    //Get Response and return
    const modelResponse = await llm.executeQuery();

    if (!modelResponse.ok) {
        throw new Error(`An error occurred when querying the LLM: ${modelResponse.error}`);
    }

    return modelResponse.data;
};


(async () => {
    const resumeText = await loadResumeFromData();


    //Define target role/query to send
    const targetRole = 'Software Engineer at a mid-size tech company';
    const userQuery = `
        Target Role: ${targetRole}

        Resume:
        ${resumeText}
        `;

    const result = await ragQuery(userQuery);
    console.log(JSON.stringify(result, null, 2));
})();

module.exports = { ragQuery, loadResumeFromData };