import socketAuth from "../middlewares/ioAuth.middleware.js"
import { registerMessageEvents } from "./message.socket.js"
import { registerChannelEvents } from "./chanel.socket.js"

export const initSocket = (io) => {
  io.use(socketAuth)
  io.on("connection", (socket) => {
    console.log("socket connected:", socket.user.userId)
    registerMessageEvents(io, socket);
    registerChannelEvents(socket);
  })
}
