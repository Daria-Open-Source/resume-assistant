import mongoose from 'mongoose';

// schema for chunk collection
const ChunkSchema = new mongoose.Schema({
    raw: String,
    vec: [Number],
    major: String,
    roles: [String],
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

export const ChunkModel = new mongoose.model('Chunk', ChunkSchema);