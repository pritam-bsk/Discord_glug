import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../users/user.model.js"
import { generateAccessToken, generateRefreshToken } from "../../utils/token.js"

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if ([username, email, password].some(field => field.trim() === '')) {
        throw new ApiError(400, "All fields are required")
    }

    const exists = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (exists) {
        throw new ApiError(400, "User already exists")
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
        username: username,
        email: email,
        passwordHash: passwordHash,
    })
    if (!user) {
        throw new ApiError(500, "Failed to create user")
    }

    res.status(201).json(
        new ApiResponse(201, { id: user._id, username: user.username, email: user.email },
            "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // console.log("loginnnnn") 

    const { email, username, password } = req.body
    // console.log(email) 

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (!user) {
        throw new ApiError(400, "Invalid credentials")
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
        throw new ApiError(400, "Invalid credentials")
    }

    const payload = { userId: user._id, username: user.username }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)
    const hashedRefresh = await bcrypt.hash(refreshToken, 10)
    await User.updateOne(
        { _id: user._id },
        { $set: { refreshToken: hashedRefresh } }
    )

    res.status(200).json(
        new ApiResponse(200, { accessToken, refreshToken }, "User logged in successfully")
    )
})

const refreshTokens = asyncHandler(async function (req, res) {
    const { refreshToken } = req.body
    if (!refreshToken) throw new ApiError(401, "refresh token is missing")

    let decoded
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    } catch (error) {
        throw new ApiError(401, "invalid refresh token")
    }

    const user = await User.findById(decoded.userId)
    if (!user) throw new ApiError(404, "no user found for this token")

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken)
    if (!isMatch) {
        throw new ApiError(401, "refresh token did not match")
    }

    const payload = { userId: user._id, username: user.username }
    const newAccessToken = generateAccessToken(payload)
    const newRefreshToken = generateRefreshToken(payload)
    const hashedRefresh = await bcrypt.hash(newRefreshToken, 10)
    await User.updateOne(
        { _id: user._id },
        { $set: { refreshToken: hashedRefresh } }
    )
    return res
        .status(200)
        .json(
            new ApiResponse(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully")
        )
})

const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken)
        throw new ApiError(400, "refresh token required")
    let decoded
    try {
        decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        )
    } catch {
        return res.status(200).json(
            new ApiResponse(200, null, "logged out")
        )
    }
    await User.updateOne(
        { _id: decoded.userId },
        { $unset: { refreshToken: "" } }
    )

    res.status(200).json(
        new ApiResponse(200, null, "logged out")
    )
})


export { registerUser, loginUser, refreshTokens, logout } 