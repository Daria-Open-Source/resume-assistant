import { TextExtractor } from "./extraction.parsers.js";
import { parseResumeServerMultiform } from "./multiform.parsers.js";
import { binaryToText } from "./binary.parsers.js"

const Extractor = new TextExtractor();
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