import mongoose from 'mongoose';

const localMetaBaseSchema = new mongoose.Schema({}, {
    discriminatorKey: 'section',
    _id: false 
});

// schema for chunk collection
const ChunkSchema = new mongoose.Schema({
    
    resumeId: mongoose.Schema.Types.ObjectId,
    localMeta: localMetaBaseSchema,
    globalMeta: {
        year: Number,
        major: [String],
        roles: [String]
    },
    raw: String,
    vec: [Number],
    section: {
        type: String,
        enum: ['education', 'experience', 'projects', 'leadership', 'skills']
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

// defines localMeta for education type chunks
ChunkSchema.path('localMeta').discriminator('education', new mongoose.Schema({
    institution:    String,
    gpa:            Number,
    degree:         String
}, { _id: false }));

// defines localMeta for experience type chunks
ChunkSchema.path('localMeta').discriminator('experience', new mongoose.Schema({
    company:    String,
    role:       String,
    toolsUsed:  [String],
    skills:     [String]
}, { _id: false }));

// defines localMeta for project type chunks
ChunkSchema.path('localMeta').discriminator('projects', new mongoose.Schema({
    toolsUsed:  [String],
    skills:     [String]
}, { _id: false }));

// defines localMeta for leadership type chunks
ChunkSchema.path('localMeta').discriminator('leadership', new mongoose.Schema({
    title:      String,
    softSkills: [String]
}, { _id: false }));

// defines localMeta for skills type chunks
ChunkSchema.path('localMeta').discriminator('skills', new mongoose.Schema({
    categories: [String],
    skills: [String]
}, { _id: false }));

ChunkSchema.statics.hasVectorIndex = true;
ChunkSchema.statics.vectorSearch = async (query, k, filters = null) => {

    const pipeline = [
        {
            $vectorSearch: {
                index: "vector-search",
                path: "vec",
                queryVector: query,
                numCandidates: k * 10,
                limit: k,
                filter: filters
            }
        },
        {
            $project: {
                raw: 1,
                vec: 1,
                score: { $meta: "vectorSearchScore" }
            }
        }
    ];

    let results = await this.model.aggregate(pipeline);
    return results;
} 
export const ChunkModel = new mongoose.model('Chunk', ChunkSchema);