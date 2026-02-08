import 'dotenv/config'
import http from "http";
import { Server } from "socket.io"
import app from "./app.js"
import { connectDB } from "./config/db.js"
import ioAuthMiddleware from "./middlewares/ioAuth.middleware.js";
import { initSocket } from './sockets/index.js'

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "*" }
})
io.use(ioAuthMiddleware)
initSocket(io);


const PORT = process.env.PORT || 8000

connectDB().then(() => {
  server.listen(PORT,"0.0.0.0", () =>
    console.log(`Server running on \nhttp://localhost:${PORT}\nhttp://<IP_ADDRESS>:${PORT}`)
  )
})
