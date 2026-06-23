import { DeadLetter } from '../models/deadLetter.model.js' 
import { Notification } from '../models/notification.model.js' 
import { addNotificationToQueue } from '../queues/notification.queue.js' 
import { ApiErrors } from '../utils/ApiErrors.js' 
import { ApiResponse } from '../utils/ApiResponse.js' 
import { asyncHandler } from '../utils/asyncHandler.js' 

export const replayDeadJob = asyncHandler(async (req, res) => {
    const { deadLetterId } = req.params 

    const deadltr= await DeadLetter.findByIdAndDelete(deadLetterId)
    if(!deadltr){
        throw new ApiErrors(404,'Dead Letter not found')
    }

    const payload=deadltr.originalPayload

    await addNotificationToQueue(payload)

    await Notification.findByIdAndUpdate(payload.notificationId, {
        status: 'queued',
        attemptsMade: 0,
        jobId: newJob.id 
    }) 

    return res.status(200)
    .json(
        new ApiResponse(
            200, 
            { originalNotificationId: payload.notificationId, newJobId: newJob.id }, 
            "Job successfully extracted from DLQ and re-queued"
        )
    )
}) 