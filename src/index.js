import 'dotenv/config'
import http from "http";
import { Server } from "socket.io"
import app from "./app.js"
import { connectDB } from "./config/db.js"
import ioAuthMiddleware from "./middlewares/ioAuth.middleware.js";
import Channel from './modules/channels/channel.model.js';
import Member from './modules/members/member.model.js';
import Message from './modules/messages/message.model.js';

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URI, credentials: true }
})
io.use(ioAuthMiddleware)
io.on("connection", (socket) => {
  console.log("socket connected:", socket.user.userId)
  socket.on("channel:join", (channelId) => {
    console.log(`channel:join ${channelId}`);
    socket.join(`channel:${channelId}`)
  })
  socket.on("channel:leave", (channelId) => {
    socket.leave(`channel:${channelId}`)
  })

  socket.on("message:send", async (data) => {
    const { channelId, content } = data;
    console.log("message:send", data);
    if (!channelId || !content?.trim()) return
    const channel = await Channel.findById(channelId)
    if (!channel) return
    const member = await Member.findOne({
      serverId: channel.serverId,
      userId: socket.user.userId
    })
    if (!member) return;
    const message = await Message.create({
      channelId,
      senderId: socket.user.userId,
      content
    })
    const addUsername = await Message.findById(message._id).populate('senderId', 'username')
    console.log("Emitting message:new", addUsername.senderId.username);
    io.to(`channel:${channelId}`).emit("message:new", addUsername)
  })
})

const PORT = process.env.PORT || 8000

connectDB().then(() => {
  server.listen(PORT, "0.0.0.0", () =>
    console.log(`Server running on \nhttp://localhost:${PORT}\nhttp://<IP_ADDRESS>:${PORT}`)
  )
})
