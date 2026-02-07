import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import Channel from "./channel.model.js"
import Server from "../servers/server.model.js"

export const createChannel = asyncHandler(async (req, res) => {
    const { name, serverId, type } = req.body
    if (![name, serverId].every(field => field && field.trim() !== '')) {
        throw new ApiError(400, "Name and serverId are required")
    }
    const server = await Server.findById(serverId)
    if (!server) {
        throw new ApiError(404, "Server not found")
    }
    if (server.ownerId.toString() !== req.user.userId) {
        throw new ApiError(403, "Forbidden: Only the server owner can create channels")
    }
    const channel = await Channel.create({
        name,
        serverId,
        type: type || "TEXT"
    })
    res.status(201).json(new ApiResponse(201, channel, "Channel created successfully"))
})

export const getChannelsByServerId = asyncHandler(async (req, res) => {
    const { serverId } = req.params
    const server = await Server.findById(serverId)
    if (!server) {
        throw new ApiError(404, "Server not found")
    }
    const channels = await Channel.find({ serverId })
    res.json(channels)
})

export const deleteChannel = asyncHandler(async (req, res) => {
    const { id } = req.params
    const channel = await Channel.findById(id)
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }
    const server = await Server.findById(channel.serverId)
    if (server.ownerId.toString() !== req.user.userId) {
        throw new ApiError(403, "Forbidden: Only the server owner can delete channels")
    }
    await Channel.findByIdAndDelete(id)
    res.json(new ApiResponse(200, null, "Channel deleted successfully"))
}) 