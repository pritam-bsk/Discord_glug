import Message from "./message.model.js"
import Channel from "../channels/channel.model.js"
import Member from "../members/member.model.js"
import mongoose from "mongoose"
import asyncHandler from "../../utils/asyncHandler.js"

export const getChannelMessages = asyncHandler(async (req, res, next) => {
    const { channelId } = req.params
    console.log("#########channelId", channelId);
    const { limit } = req.query
    const channel = await Channel.findById(channelId)
    console.log(channel);
    if (!channel) {
        return res.status(404).json({ message: "Channel not found" })
    }
    console.log(channelId);
    const messages = await Message.find({ channelId, deleted: false }).populate('senderId', 'username').sort({ createdAt: 1 }).limit(limit || 30)
    res.json(messages)
})