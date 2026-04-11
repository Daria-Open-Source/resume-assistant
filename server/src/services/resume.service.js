class ResumeService {

    // takes no dependencies at instantiation
    constructor(
        model,
        ParsingService,
        EmbeddingService,
    ) {

        if (null in [model, ParsingService, EmbeddingService])
            throw new Error('One or more inputs to ResumeService were null');

        this.model    = model;
        this.parser   = ParsingService;
        this.embedder = EmbeddingService;
        this.chunks   = ChunksModel;
    }

    async getNewResumes(ResumeSource) {
        
        // get the ids of resumes in the collection
        const resumes = await this.model.find();
        const oldIds = resumes.map(resume => resume.sourceId.value);

        // pass the oldIds as a filter to the ResumeSource
        const newResumes = await ResumeSource.getResumes(oldIds);
        return newResumes;        
    }

    async saveToDatabase(resumes) {
        if (Array.isArray(resumes))
            await this.model.bulkWrite(resumes);
        else
            await this.model.insert(resumes);
    }

    async chunkResumes(resumes) {
        
    }

};