import { Router } from "express"
import auth from "../../middlewares/auth.middleware.js"
import { createChannel } from "../channels/channel.controller.js"

const router = Router()

router.post("/", auth, createChannel)

export default router 
