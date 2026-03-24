import { MixedBreadEmbeddingModel } from "../integration/embedding.integration.js";
import { GroqLanguageModel } from '../integration/llm.integration.js'
import { VectorStore } from "./vectorStore.orchestration.js";

export const doQuery = async (userQuery) => {

    // initialize objects
    const Embedder = new MixedBreadEmbeddingModel();
    const LLM = new GroqLanguageModel();
    const Store = new VectorStore();

    // connect services
    await Embedder.initialize();

    // vectorize the user query
    const vectorizedQuery = await Embedder.embed([userQuery]);
    console.log(vectorizedQuery);

    // parse their resume to build more context??
    // this step can infer a major, and likely targeted roles 
    // no code for this, but would be accomplished with Groq
    // filters = {}
    
    // run the query on the vector store
    const kDocsPerSection = await Store.vectorSearch(
        vectorizedQuery,
        5
    );

    // Call the LLM
    LLM.preparePrompt(userQuery, kDocsPerSection);

    // Run the prompt
    const response = await LLM.executePrompt();

    return response;
};