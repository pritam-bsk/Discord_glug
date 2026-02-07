import 'dotenv/config'
import http from "http"
import { Server } from "socket.io"
import app from "./app.js"
import { connectDB } from "./config/db.js"
import ioAuthMiddleware from "./middlewares/ioAuth.middleware.js"

const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: "*" }
})

io.use(ioAuthMiddleware)
io.on("connection", (socket) => {
  console.log("socket connected:", socket.user.userId)
})

const PORT = process.env.PORT || 8000

connectDB().then(() => {
  server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  )
})
