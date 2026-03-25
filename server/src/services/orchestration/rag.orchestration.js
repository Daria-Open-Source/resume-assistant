import { MixedBreadEmbeddingModel } from "../integration/embedding.integration.js";
import { GroqLanguageModel } from '../integration/llm.integration.js'
import { VectorStore } from "../persistence/vectorStore.persistence.js";

// Make objects
const Embedder = new MixedBreadEmbeddingModel();
const LLM = new GroqLanguageModel();
const Store = new VectorStore();

// connect services
await Embedder.initialize();

export const doQuery = async (userQuery, resumeChunks) => {    

    // vectorize the user query
    const vectorizedQuery = await Embedder.embed([userQuery]);

    // parse their resume to build more context??
    // this step can infer a major, and likely targeted roles 
    // no code for this, but would be accomplished with Groq
    // filters = {}
    
    // run the query on the vector store
    console.log(resumeChunks);
    const queries = Object.keys(resumeChunks).map( async section => {
        console.log(section);
        return await Store.vectorSearch(
            vectorizedQuery[0],
            5,
            { section }
        );
    });

    const results = await Promise.all(queries);
    console.log(results);

    // Call the LLM
    LLM.preparePrompt(userQuery, modelContext);

    // Run the prompt
    const response = await LLM.executePrompt();

    return response;
};