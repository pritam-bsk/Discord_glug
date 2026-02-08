import { Router } from "express";
import { getChannelMessages } from "./message.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/:channelId", authMiddleware, getChannelMessages)

export default router;