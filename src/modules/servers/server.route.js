import { Router } from "express";
import auth from "../../middlewares/auth.middleware.js";
import { createServer } from "./server.controller.js";

const router = Router();

router.post("/", auth, createServer);

export default router;
