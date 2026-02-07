import { Router } from "express";
import auth from "../../middlewares/auth.middleware.js";
import { createServer } from "./server.controller.js";
import { getServerChannels } from "./server.controller.js";

const router = Router();

router.post("/", auth, createServer);
router.get("/:serverId/channels", auth, getServerChannels);

export default router;
