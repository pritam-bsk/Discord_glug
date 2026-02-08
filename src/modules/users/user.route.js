import { Router } from "express"
import authMiddleware from "../../middlewares/auth.middleware.js"
import User from "./user.model.js"
import { getUserById } from "./user.controller.js"
import asyncHandler from "../../utils/asyncHandler.js"

const router = Router()
router.get("/me", authMiddleware, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId)
        .select("-passwordHash -refreshToken")

    if (!user)
        return res.status(404).json({ message: "user not found" })

    res.json(user)
}))
router.get("/:userid", asyncHandler(getUserById))


export default router 
