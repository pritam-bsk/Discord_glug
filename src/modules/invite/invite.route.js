import { Router } from "express";
import {joinViaInvite} from "./invite.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/join/:inviteCode", authMiddleware, joinViaInvite)

export default router;