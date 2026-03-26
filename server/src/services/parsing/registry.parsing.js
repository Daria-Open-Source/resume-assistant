import { TextExtractor } from "./extraction.parsing.js";
import { parseResumeServerMultiform } from "./multiform.parsing.js";
import { binaryToText } from "./binary.parsing.js"

const Extractor = new TextExtractor();
export const ParsingRegistry = {

    // arrow functions fix a scoping issue with the Extractor variable
    "chunkResume": (resume) => Extractor.chunkResumeText(resume),
    "getMetadata": (resume) => Extractor.extractResumeMetadata(resume),
    "parseResponse": parseResumeServerMultiform,
    "getText": binaryToText
};