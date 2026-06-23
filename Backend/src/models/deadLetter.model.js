import mongoose, {Schema} from 'mongoose'

const deadLetterSchema = new Schema(
    {
        jobId: {
            type: String,
            required: true,
            index: true // CRITICAL: O(1) lookups for the "Replay" dashboard button
        },
        notificationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification',
            required: true
        },
        originalPayload: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        failureReason: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

export const DeadLetter = mongoose.model('DeadLetter',deadLetterSchema)