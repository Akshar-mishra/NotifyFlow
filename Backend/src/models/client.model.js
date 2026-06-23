import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    clientId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    apiKeyHash: {
        type: String,
        required: true,
        unique: true,
        index: true 
    },
    rateLimitWindow: {
        type: Number,
        default: 60000 
    },
    maxRequestsPerWindow: {
        type: Number,
        default: 100 
    }
}, {
    timestamps: true
});

export const Client = mongoose.model('Client', clientSchema);