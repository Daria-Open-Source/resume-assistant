import { parseResumeServerMultiform } from "./multiform.parsers.js";
import { binaryToText } from "./binary.parsers.js"

export const ParserRegistry = {
    "parseResponse": parseResumeServerMultiform,
    "getText": binaryToText
};