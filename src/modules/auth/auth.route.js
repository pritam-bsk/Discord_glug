import { Router } from "express"
import { registerUser, loginUser, refreshTokens, logout } from "./auth.controller.js"

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/refresh", refreshTokens)
router.post("/logout", logout)

export default router 
