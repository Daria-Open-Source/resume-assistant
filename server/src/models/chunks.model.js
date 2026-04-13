import mongoose from 'mongoose';

const localMetaBaseSchema = new mongoose.Schema({}, { _id: false, discriminatorKey: '__t' });

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
    strict: 'throw'
});

// defines localMeta for education type chunks
ChunkSchema.path('localMeta').discriminator('education', new mongoose.Schema({
    school:     String,
    major:      [String],
    gpa:        [{_id: false, qualifier: { type: String, enum: ['overall', 'in-major', 'undergraduate', 'graduate', 'semester'] }, number: Number}],
    coursework: [String],
//    section:    { type: String, default: 'education' }
}, { _id: false }));

// defines localMeta for experience type chunks
ChunkSchema.path('localMeta').discriminator('experience', new mongoose.Schema({
    company:    String,
    role:       [String],
    toolsUsed:  [String],
    skills:     [String],
//    section:    { type: String, default: 'experience' }
}, { _id: false }));

// defines localMeta for project type chunks
ChunkSchema.path('localMeta').discriminator('projects', new mongoose.Schema({
    toolsUsed:  [String],
    skills:     [String],
//    section:    { type: String, default: 'projects' }
}, { _id: false }));

// defines localMeta for leadership type chunks
ChunkSchema.path('localMeta').discriminator('leadership', new mongoose.Schema({
    role:       [String],
    group:      String,
    skills:     [String],
    toolsUsed:  [String],
//    section:    { type: String, default: 'leadership' }
}, { _id: false }));

// defines localMeta for skills type chunks
ChunkSchema.path('localMeta').discriminator('skills', new mongoose.Schema({
    categories: [String],
    tools:      [String],
    skills:     [String],
//    section:    { type: String, default: 'skills' }
}, { _id: false }));

export const ChunkModel = new mongoose.model('Chunk', ChunkSchema);