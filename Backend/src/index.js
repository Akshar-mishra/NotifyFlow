import dotenv from 'dotenv'
import app from './app.js'
import { getRedisInstance } from './db/redis.js'
import connectDB from './db/index.js'

dotenv.config({
    path:"./.env"
})

const startServer = async () => {
    try {
        await connectDB() 

        const redis = getRedisInstance() 
        await redis.ping()  
        console.log("Redis Ping Successful: Connection verified.") 

        const PORT = process.env.PORT || 8000 
        app.listen(PORT, () => {
            console.log(` Server is running at port : ${PORT}`) 
        }) 

    } catch (error) {
        console.error("Server Initialization Failed:", error) 
        process.exit(1) 
    }
}

startServer()