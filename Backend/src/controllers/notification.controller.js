import { Notification } from "../models/notification.model.js" 
import { asyncHandler } from '../utils/asyncHandler.js' 
import { ApiErrors } from '../utils/ApiErrors.js'  // Ensure your utility file is singular
import { ApiResponse } from '../utils/ApiResponse.js' 
import crypto from 'crypto' 
import { addNotificationToQueue } from '../queues/notification.queue.js' 

export const createNotification = asyncHandler(async (req, res) => {
    const { to, subject, body, webhookUrl } = req.body 
    if (!to || !subject || !body) {
        throw new ApiErrors(400, "Missing required fields: to, subject, or body") 
    }

    const tempJobId = `pending_${crypto.randomUUID()}` 

    const notificationDoc = await Notification.create({
        jobId: tempJobId,
        to,
        subject,
        body,
        webhookUrl: webhookUrl || null,
        status: 'queued'
    }) 

    const job = await addNotificationToQueue({
        to,
        subject,
        body,
        webhookUrl,
        notificationId: notificationDoc._id 
    }) 

    notificationDoc.jobId = job.id 
    await notificationDoc.save({ validateBeforeSave: false }) 

    return res.status(201).json(
        new ApiResponse(201, {
            _id: notificationDoc._id,
            jobId: notificationDoc.jobId,
            status: notificationDoc.status
        }, "Notification successfully queued in BullMQ.")
    ) 
}) 