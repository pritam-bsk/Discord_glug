import { Router } from "express" 
import authRoutes from "./modules/auth/auth.route.js" 
import userRoutes from "./modules/users/user.route.js" 
import serverRoutes from "./modules/servers/server.route.js" 
import channelRoutes from "./modules/channels/channel.route.js" 
import messageRoutes from "./modules/messages/message.router.js"

const router = Router() 

router.use("/auth", authRoutes) 
router.use("/users", userRoutes) 
router.use("/servers", serverRoutes) 
router.use("/channels", channelRoutes) 
router.use("/messages", messageRoutes)

export default router 