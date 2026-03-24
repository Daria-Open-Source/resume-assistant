import { MixedBreadEmbeddingModel } from "../integration/embedding.integration.js";
import { GroqLanguageModel } from '../integration/llm.integration.js'
import { VectorStore } from "../persistence/vectorStore.persistence.js";

// Make objects
const Embedder = new MixedBreadEmbeddingModel();
const LLM = new GroqLanguageModel();
const Store = new VectorStore();

export const doQuery = async (userQuery) => {

    // connect services
    await Embedder.initialize();

    // vectorize the user query
    const vectorizedQuery = await Embedder.embed([userQuery]);

    // parse their resume to build more context??
    // this step can infer a major, and likely targeted roles 
    // no code for this, but would be accomplished with Groq
    // filters = {}
    
    // run the query on the vector store
    const kDocsPerSection = await Store.vectorSearch(
        vectorizedQuery,        // vector used in similarity search
        5                       // controls the # of results to return in each section
    );

    // Call the LLM
    LLM.preparePrompt(userQuery, kDocsPerSection);

    // Run the prompt
    const response = await LLM.executePrompt();

    return response;
};