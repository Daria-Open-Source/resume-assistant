import { HuggingFaceEmbeddingModel } from "./huggingface.embed.js";
import { MixedBreadEmbeddingModel } from "./mixedbread.embed.js";
import { OllamaEmbeddingModel } from "./ollama.embed.js";

// const hf = new HuggingFaceEmbeddingModel();
const mb = new MixedBreadEmbeddingModel();
const ol = new OllamaEmbeddingModel();

await Promise.all([
    // await hf.initialize(),
    await mb.initialize(),
    await ol.initialize()
]);

export const EmbeddingRegistry = {
    // "HUGGING_FACE": hf,
    "MIXED_BREAD":  mb,
    "OLLAMA":       ol
};