import { Router } from "express"
import auth from "../../middlewares/auth.middleware.js"
import { createServer, getUserServers, getServerChannels } from "./server.controller.js"
import { createChannel } from "../channels/channel.controller.js"
import { createInvite } from "../invite/invite.controller.js"

const router = Router()

router.get("/", auth, getUserServers)
router.post("/", auth, createServer)
router.get("/:serverId/channels", auth, getServerChannels)
router.post("/:serverId/channels", auth, createChannel)
router.post("/:serverId/invites", auth, createInvite)

export default router 
