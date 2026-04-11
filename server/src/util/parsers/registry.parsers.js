import { TextExtractor } from "./extraction.parsers.js";
import { parseResumeServerMultiform } from "./multiform.parsers.js";
import { binaryToText } from "./binary.parsers.js"
import { GroqLLM } from "../../infra/llm/groq.llm.js";
import { OllamaLLM } from "../../infra/llm/ollama.llm.js";

// LLM dependency for TextExtractor
const gq = new GroqLLM();
const ol = new OllamaLLM();

// pick a model for TextExtractor to use when parsing
// const Extractor = new TextExtractor(ol);
const Extractor = new TextExtractor(gq);

export const ParsingRegistry = {

    // arrow functions fix a scoping issue with the Extractor variable
    "chunkResume": async (resume) => await Extractor.chunkResumeText(resume),
    "getMetadata": async (resume) => await Extractor.extractResumeMetadata(resume),
    "getGlobalMetadata": async (resume) => await Extractor.extractGlobalMetadata(resume),
    "chunkResume_nowait": (resume) => Extractor.chunkResumeText(resume),
    "getMetadata_nowait": (resume) => Extractor.extractResumeMetadata(resume),
    "getGlobalMetadata_nowait": (resume) => Extractor.extractGlobalMetadata(resume),
    "parseResponse": parseResumeServerMultiform,
    "getText": binaryToText
};