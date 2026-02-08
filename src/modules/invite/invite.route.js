import { Router } from "express";
import { joinViaInvite, createInvite } from "./invite.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/create/:serverId", authMiddleware, createInvite);
router.post("/join/:code", authMiddleware, joinViaInvite);

export default router;