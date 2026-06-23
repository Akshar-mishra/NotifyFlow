import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGINS ,
    credentials: true
}))

app.use(express.urlencoded({extended:true , limit:'16kb'}))
app.use(express.json({limit:'16kb'}))
app.use(cookieParser())

app.use("/api/v1/check", (req, res) => {
    res.json({ success: true, message: "Backend is running" })
})

import notificationRouter from './routes/notification.router.js'
app.use("/api/v1/notify",notificationRouter)

import adminRouter from './routes/admin.router.js'
app.use("/api/v1/admin",adminRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500  
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    })  
})  

export default app
