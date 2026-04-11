import { GroqLLM } from "./groq.llm.js";
import { OllamaLLM } from "./ollama.llm.js";

const gq = new GroqLLM();
const ol = new OllamaLLM();

export const ModelRegistry = {
    'GROQ':   gq,
    'Ollama': ol
};