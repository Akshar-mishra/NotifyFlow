import { getRedisInstance } from '../db/redis.js'  
import { ApiErrors } from '../utils/ApiErrors.js'  
import { asyncHandler } from '../utils/asyncHandler.js'  

export const rateLimiter = asyncHandler(async (req, res, next) => {
    const redis = getRedisInstance()  
    const clientIp = req.ip  
    const limit = 5   
    const windowSeconds = 60   
    const redisKey = `rate_limit:${clientIp}`  

    const currentCount = await redis.incr(redisKey)  

    if (currentCount === 1) {
        await redis.expire(redisKey, windowSeconds)  
    }

    if (currentCount > limit) {
        throw new ApiErrors(429, "Too many requests. Please try again in a minute.")  
    }

    next()  
})  