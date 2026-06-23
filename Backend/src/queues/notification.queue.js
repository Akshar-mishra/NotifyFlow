import {Queue} from 'bullmq'
import { getRedisInstance } from '../db/redis.js'

const redisOptions = {
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null 
}

export const notificationQueue = new Queue('notification-queue', {connection: redisOptions})

export const addNotificationToQueue = async (payload) => {
    const job = await notificationQueue.add('send-email', payload, {
        removeOnComplete: true, 
        removeOnFail: false,  
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000 //base delay
        }
    })

    return job
}
