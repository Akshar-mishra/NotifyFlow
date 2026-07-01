import crypto from 'crypto' 
import { ApiErrors } from '../utils/ApiErrors.js' 
import { asyncHandler } from '../utils/asyncHandler.js' 
import { Client } from '../models/client.model.js' 

export const authValidator = asyncHandler(async (req, res, next) => {

    const rawApiKey = req.headers['x-api-key']

    if (!rawApiKey) {
        throw new ApiErrors(401, "Unauthorized: No API key provided.");
    }

    const apiKey = rawApiKey.replace(/['"]/g, '').trim();

    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex') 

    const client = await Client.findOne({ apiKeyHash: hashedKey }) 

    if (!client) {
        throw new ApiErrors(403, "Forbidden: Invalid API key.") 
    }

    req.clientId = client._id 

    next() 
}) 