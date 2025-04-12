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
const initialPlayers = [
    { id: "1", name: "Example player" },
];
const initialGameState = {
    gameCode: "",
    host: "",
    teams: {
        team1: { players: [], points: 0 },
        team2: { players: [], points: 0 },
        team3: { players: [], points: 0 },
        waiting: { players: initialPlayers, points: 0 },
    }
};
let gameStates = {};
// Socket.IO connection handler
io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);
    socket.on("initializePlayers", (data, callback) => {
        callback(gameStates[data.gameCode].teams);
    });
    socket.on('initializeGameCode', (data) => {
        gameStates[data.gameCode] = {
            gameCode: "",
            host: "",
            teams: {
                team1: { players: [], points: 0 },
                team2: { players: [], points: 0 },
                team3: { players: [], points: 0 },
                waiting: { players: [{ id: "1", name: "Example player" }], points: 0 },
            }
        };
        gameStates[data.gameCode].gameCode = data.gameCode;
    });
    socket.on('setGameCode', (data) => {
        if (data.gameCode in gameStates) {
            gameStates[data.gameCode].gameCode = data.gameCode; //kinda useless
        }
        else {
            gameStates[data.gameCode] = initialGameState;
            gameStates[data.gameCode].gameCode = data.gameCode;
        }
    });
    socket.on('getCompleteGameStateSenderOnly', (data) => {
        // return Game state to the sender only 
        // io.emit?
    });
    socket.on("playerJoinedGame", (data) => {
        const newPlayer = data;
        // Add player to waiting lists
        if (data.gameCode in gameStates) {
            gameStates[data.gameCode].teams.waiting.players.push(newPlayer);
            io.emit("playerAddedToWaitingList", gameStates[data.gameCode].teams);
        }
        else {
            console.log("We got problem houston. addPlayerToWaiting is working with empty gameCode.");
        }
    });
    socket.on("movePlayer", (data, callback) => {
        const teams = gameStates[data.gameCode].teams;
        movePlayer(teams, data.playerId, data.fromTeam, data.toTeam);
        callback(teams);
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
// Helper function to move a player between teams
const movePlayer = (teams, playerId, fromTeam, toTeam) => {
    const maxPlayersPerTeam = 20;
    // Find the player and teams
    const playerIndex = teams[fromTeam].players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1)
        return;
    const player = teams[fromTeam].players[playerIndex];
    const fromTeamPlayers = [...teams[fromTeam].players];
    const toTeamPlayers = teams[toTeam].players;
    // Ensure we don't exceed the max players per team
    if (toTeamPlayers.length >= maxPlayersPerTeam) {
        console.log(`Team ${toTeam} is full`);
        return;
    }
    // Remove player from the original team and add to the new team
    teams[fromTeam].players = fromTeamPlayers.splice(playerIndex, 1);
    teams[toTeam].players = [...toTeamPlayers, player];
};
