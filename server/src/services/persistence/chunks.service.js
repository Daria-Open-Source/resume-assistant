import mongoose from 'mongoose';

// schema for chunk collection
const ResumeChunkSchema = new mongoose.Schema({

    raw: String,
    vec: Array,
    resumeId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
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