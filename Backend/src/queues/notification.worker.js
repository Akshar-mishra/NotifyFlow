import 'dotenv/config'
import { Worker } from 'bullmq'  
import { Notification } from '../models/notification.model.js'  
import connectDB from '../db/index.js'
import {sendEmail} from '../services/mailer.service.js'
import {DeadLetter} from '../models/deadLetter.model.js'

connectDB()  

const redisOptions = {
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null
}  

const notificationWorker = new Worker("notification-queue", async (job) => {
    const { to, subject, body, notificationId } = job.data  
    await Notification.findByIdAndUpdate(notificationId, { status: 'processing', attemptsMade: job.attemptsMade })  
    try {
        await sendEmail(to, subject, body)
        await Notification.findByIdAndUpdate(notificationId, {
            status: 'sent',
            deliveredAt: new Date()
        })
    } 
    catch (err) {
        await Notification.findByIdAndUpdate(notificationId, {
            status: 'failed',
            error: err.message
        })
        throw err
    } 
     
}, { connection: redisOptions })  



notificationWorker.on('completed', (job) => {
    console.log(`Job ${job.id} has fully completed and closed. `)  
})  

notificationWorker.on('failed', async(job, err) => {
    if (job.attemptsMade >= job.opts.attempts) {
        console.log(`☠️ Job ${job.id} permanently failed after ${job.attemptsMade} attempts. Moving to DLQ...`) 
        try {
            await DeadLetter.create({
                jobId: job.id,
                notificationId: job.data.notificationId, 
                originalPayload: job.data,
                failureReason: err.message, 
                exhaustedAt: new Date()
            }) 

            await Notification.findByIdAndUpdate(job.data.notificationId, {
                status: 'dead',
                updatedAt: new Date()
            })
            console.log(`[DLQ] Job ${job.id} successfully secured in dead letter storage.`) 
        } 
        catch (dbErr) {
            console.error(`[CRITICAL] Failed to write Job ${job.id} to DLQ MongoDB collection:`, dbErr)
        }
    } 
    else {
        console.log(`⏳ Job ${job.id} failed but will retry (Attempt ${job.attemptsMade}/${job.opts.attempts})...`) 
    } 
})  