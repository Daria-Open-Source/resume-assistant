import { ModelRegistry } from "../infra/llm/registry.llm.js";
import { EmbeddingRegistry } from "../infra/embed/registry.embed.js";
import { VectorStore } from "./vectorStore.persistence.js";

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
    const queries = Object.keys(resumeChunks).map(async section => {
        return await Store.vectorSearch(
            vectorizedQuery[0],
            5,
            { section }
        );
    });

    // wait for all queries to resolve
    const modelContext = await Promise.all(queries);
    console.log(modelContext);
    
    // Run the prompt
    const response = await LLM.executePrompt(SYSTEM_PROMPT, userQuery, modelContext);

    return response;
};