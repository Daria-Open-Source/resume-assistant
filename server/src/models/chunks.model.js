import mongoose from 'mongoose';

// schema for chunk collection
const ChunkSchema = new mongoose.Schema({
    raw: String,
    vec: [Number],
    date: mongoose.Schema.Types.Date,
    year: Number,
    major: String,
    jobs: [String],
    section: {
        type: String,
        enum: ['education', 'experience', 'projects', 'leadership', 'skills']
    },
    resumeId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

export const ChunkModel = new mongoose.model('Chunk', ChunkSchema);