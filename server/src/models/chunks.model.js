import mongoose from 'mongoose';

// schema for chunk collection
const ResumeChunkSchema = new mongoose.Schema({
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

export const Chunk = new mongoose.model('Chunk', ResumeChunkSchema);