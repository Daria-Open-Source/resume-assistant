import { ParsingRegistry } from "../util/parsers/registry.parsers.js";

export class ResumeService {

    // takes no dependencies at instantiation
    // instead uses dependency injection at runtime
    constructor() {}

    // @requires:
    // -> ResumeProvider to provide resumes
    // @returns:
    // -> a string of new resumes not in the database
    async getResumesFromRemote(ResumeProvider, Database) {

        // get the ids of resumes in the collection
        const resumes = await Database.find();
        const oldIds = resumes.map(resume => resume.sourceId.value);

        // pass the oldIds as a filter to the ResumeSource
        const newResumes = await ResumeProvider.get({ 'filter': oldIds });
        return newResumes;
    }

    // @requires:
    // -> resumes to be JSON or an array of JSONS
    // -> database to be a Mongoose Schema
    async saveToDatabase(resumes, database) {
        
        // optimized for multiple documents
        if (Array.isArray(resumes)) await database.bulkWrite(resumes);
        
        // optimized for single insert
        else await database.insert(resumes);
    }

    // @requires:
    // -> resumes to be String or an array of Strings
    async chunkResumes(resumes) {

        // converts to array so we can use .map
        if (!Array.isArray(resumes)) resumes = [resumes];

        
        const TextChunker = ParsingRegistry.chunkResume;

        let chunked = [];


    }

};