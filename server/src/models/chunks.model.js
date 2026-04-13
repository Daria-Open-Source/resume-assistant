import mongoose from 'mongoose';

const localMetaBaseSchema = new mongoose.Schema({}, { _id: false });

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
    },
    discriminatorKey: 'section'
});

// defines localMeta for education type chunks
ChunkSchema.path('localMeta').discriminator('education', new mongoose.Schema({
    school: {
        type: String,
        required: true
    },
    major:      [String],
    gpa: [{   
        _id:    false,
        qualifier: {
            type:   String,
            enum:   ['overall', 'in-major', 'undergraduate', 'graduate', 'semester']
        },
        number: Number
    }],
    coursework: [String]
}, { _id: false }));

// defines localMeta for experience type chunks
ChunkSchema.path('localMeta').discriminator('experience', new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    role:       [String],
    toolsUsed:  [String],
    skills:     [String]
}, { _id: false }));

// defines localMeta for project type chunks
ChunkSchema.path('localMeta').discriminator('projects', new mongoose.Schema({
    toolsUsed:  {
        type: [String],
        required: true
    },
    skills:     [String] 
}, { _id: false }));

// defines localMeta for leadership type chunks
ChunkSchema.path('localMeta').discriminator('leadership', new mongoose.Schema({
    role:       [String],
    group:      {
        type: String,
        required: true
    },
    skills:     [String],
    toolsUsed:  [String]
}, { _id: false }));

// defines localMeta for skills type chunks
ChunkSchema.path('localMeta').discriminator('skills', new mongoose.Schema({
    categories: [String],
    tools:      [String],
    skills:     {
        type: [String],
        required: true
    }
}, { _id: false }));

export const ChunkModel = new mongoose.model('Chunk', ChunkSchema);