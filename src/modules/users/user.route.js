import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import User from "./user.model.js";

const router = Router();
router.get("/me", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId)
        .select("-passwordHash -refreshToken");

    if (!user)
        return res.status(404).json({ message: "user not found" });

    res.json(user);
});

export default router;
