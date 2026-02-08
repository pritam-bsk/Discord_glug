import Server from "./server.model.js"
import Member from "../members/member.model.js"
import Channel from "../channels/channel.model.js"
import ApiError from "../../utils/ApiError.js"
import asyncHandler from "../../utils/asyncHandler.js"

export const createServer = asyncHandler(async (req, res) => {
  const { name } = req.body
  if (!name) {
    throw new ApiError(400, "Server name is required")
  }
  const server = await Server.create({
    name,
    ownerId: req.user.userId
  })
  await Member.create({
    serverId: server._id,
    userId: req.user.userId,
    role: "OWNER"
  })
  await Channel.create({
    serverId: server._id,
    name: "general",
    type: "TEXT"
  })

  res.status(201).json(server)
})

export const getUserServers = asyncHandler(async (req, res) => {
  const members = await Member.find({ userId: req.user.userId }).populate("serverId")
  const servers = members.map(member => member.serverId)
  res.json(servers)
})

export const getServerById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const server = await Server.findById(id)
  if (!server) {
    throw new ApiError(404, "Server not found")
  }
  res.json(server)
})

export const deleteServer = asyncHandler(async (req, res) => {
  const { id } = req.params
  const server = await Server.findById(id)
  if (!server) {
    throw new ApiError(404, "Server not found")
  }
  if (server.ownerId.toString() !== req.user.userId) {
    throw new ApiError(403, "Forbidden: Only the server owner can delete the server")
  }
  await Server.findByIdAndDelete(id)
  res.json({ message: "Server deleted successfully" })
})

export const getServerChannels = asyncHandler(async (req, res) => {
  const { serverId } = req.params
  const userId = req.user.userId
  const membership = await Member.findOne({ serverId, userId })
  if (!membership) {
    throw new ApiError(403, "Forbidden: You are not a member of this server")
  }
  const channels = await Channel.find({ serverId })
  res.json(channels)
}) 