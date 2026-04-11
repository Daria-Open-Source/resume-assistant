import { HuggingFaceEmbeddingModel } from "./huggingface.embed.js";
import { MixedBreadEmbeddingModel } from "./mixedbread.embed.js";
import { OllamaEmbeddingModel } from "./ollama.embed.js";

const hf = new HuggingFaceEmbeddingModel();
await hf.initialize();

const mb = new MixedBreadEmbeddingModel();
await mb.initialize();

const ol = new OllamaEmbeddingModel();
await ol.initialize();

export const EmbeddingRegistry = {
    "HUGGING_FACE": hf,
    "MIXED_BREAD":  mb,
    "OLLAMA":       ol
};