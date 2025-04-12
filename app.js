"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
// Create Express app and HTTP server
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Create Socket.IO server with CORS config
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Set to your frontend URL in production
        methods: ["GET", "POST"]
    }
});
// Socket.IO connection handler
io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);
    socket.on("client-joined", (data) => {
        console.log("📲 Client joined:", data);
        io.emit("update-host", data); // Broadcast to all connected clients
    });
    socket.on("playerJoinedGame", (data) => {
        io.emit("playerJoinedGame", data);
    });
    socket.on("hostUpdatePlayerList", (data) => {
        io.emit("hostUpdatePlayerList", data);
    });
    socket.on("disconnect", () => {
        console.log("💨 Client disconnected:", socket.id);
    });
});
// Start the server
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Socket.IO server running at http://localhost:${PORT}`);
});
