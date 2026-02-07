import { Router } from "express";
import authRoutes from "./modules/auth/auth.route.js";
import userRoutes from "./modules/users/user.route.js";
import serverRoutes from "./modules/servers/server.route.js"

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

router.use("/servers", serverRoutes);

export default router;