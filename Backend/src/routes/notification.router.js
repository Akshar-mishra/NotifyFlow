import { createNotification } from "../controllers/notification.controller.js"
import {Router} from "express"

const router=Router()

router.route("/").post(createNotification)

export default router