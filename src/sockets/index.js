import socketAuth from "../middlewares/socketAuth.middleware.js"


export const initSocket = (io) => {

  io.use(socketAuth)

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.user.userId)
  })
} 
