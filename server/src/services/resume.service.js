class ResumeService {

    // takes no dependencies at instantiation
    // instead uses dependency injection at runtime
    constructor() {}


    async getNewResumes(ResumeProvider) {
        
        // get the ids of resumes in the collection
        const resumes = await this.model.find();
        const oldIds = resumes.map(resume => resume.sourceId.value);

        // pass the oldIds as a filter to the ResumeSource
        const newResumes = await ResumeProvider.getResumes(oldIds);
        return newResumes;
    }

    async saveToDatabase(resumes, database) {
        if (Array.isArray(resumes))
            await database.bulkWrite(resumes);
        else
            await database.insert(resumes);
    }

    async chunkResumes(ParsingService) {
        const TextChunker = ParsingService.
    }

};