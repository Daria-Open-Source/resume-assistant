import { HuggingFaceEmbeddingModel } from "../integration/embedding.service.js";
import { GroqLanguageModel } from '../integration/llm.service.js'
import { VectorStore } from "./vectorStore.service.js";

export const doQuery = async (userQuery) => {

    // initialize objects
    const Embedder = new HuggingFaceEmbeddingModel();
    const LLM = new GroqLanguageModel();
    const Store = new VectorStore();

    // vectorize the user query
    const vectorizedQuery = await Embedder.embed([userQuery]);
    
    // parse their resume to build more context??
    // this step can infer a major, and likely targeted roles 
    // no code for this, but would be accomplished with Groq
    // filters = {}
    
    // run the query on the vector store
    const kRelevantDocs = Store.vectorSearch(
        vectorizedQuery,
        5
    );

    // 



};