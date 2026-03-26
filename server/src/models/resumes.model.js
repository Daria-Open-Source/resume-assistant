import mongoose from 'mongoose';

// schema for chunk collection
const ResumeSchema = new mongoose.Schema({
    
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

export const ResumeModel = new mongoose.model('Resume', ResumeSchema);