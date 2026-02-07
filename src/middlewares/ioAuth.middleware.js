import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

export default (socket, next) => {
    try {
        const token = socket.handshake.auth?.token
        if (!token) throw new ApiError(404, "accessToken missing")
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        if (!decoded) throw new ApiError(401, "invalid access token")
        socket.user = decoded
        next()
    } catch (error) {
        next(new ApiError(401, "Invalid access token"))
    }
}