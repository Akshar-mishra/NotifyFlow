import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        jobId: {
            type: String,
            required: true,
            unique: true,
            index: true 
        },
        to: {
            type: String,
            required: true,
            trim: true
        },
        subject: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["queued", "processing", "sent", "failed", "dead"],
            default: "queued"
        },
        attemptsMade: {
            type: Number,
            default: 0
        },
        webhookUrl: {
            type: String,
            trim: true,
            default: null
        },
        webhookFired: {
            type: Boolean,
            default: false
        },
        error: {
            type: String,
            default: null
        },
        processedAt: {
            type: Date,
            default: null
        },
        deliveredAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);