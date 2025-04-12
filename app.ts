import express, { Express } from "express"
import http from "http"
import { Server, Socket } from "socket.io"

// Create Express app and HTTP server
const app: Express = express()
const server = http.createServer(app)

// Create Socket.IO server with CORS config
const io = new Server(server, {
  cors: {
    origin: "*", // Set to your frontend URL in production
    methods: ["GET", "POST"]
  }
})

// Define types for data if you want stricter structure
interface ClientData {
  userType: string
  timestamp: string
}

// Socket.IO connection handler
io.on("connection", (socket: Socket) => {
  console.log("⚡ Client connected:", socket.id)

  socket.on("client-joined", (data: ClientData) => {
    console.log("📲 Client joined:", data)
    io.emit("update-host", data) // Broadcast to all connected clients
  })

  socket.on("playerJoinedGame", (data) => { 
    io.emit("playerJoinedGame", data)
})


socket.on("hostUpdatePlayerList", (data) => { 
  io.emit("hostUpdatePlayerList", data)
})

  socket.on("disconnect", () => {
    console.log("💨 Client disconnected:", socket.id)
  })
})

// Start the server
const PORT = 3001
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running at http://localhost:${PORT}`)
})
