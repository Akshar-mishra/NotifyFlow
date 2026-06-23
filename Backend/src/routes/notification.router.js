import { createNotification } from "../controllers/notification.controller.js"
import {Router} from "express"
import { rateLimiter } from '../middleware/rateLimiter.js'
import { authValidator } from '../middleware/authValidator.js'

const router=Router()

router.route("/").post(authValidator, rateLimiter, createNotification)

export default router