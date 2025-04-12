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

type Player = {
  id: string
  name: string
  // team: "waiting" | "team1" | "team2" | "team3"
}

type TeamGameState = {
  players: Player[]
  points: number
}

export type Teams = {
  team1: TeamGameState
  team2: TeamGameState
  team3: TeamGameState
  waiting: TeamGameState
}

// Defining the type for the game context state
type GameState = {
  gameCode: string
  host: string
  teams: Teams
}


const initialPlayers: Player[] = [
  { id: "1", name: "Example player" },
]

const initialGameState: GameState = {
  gameCode: "",
  host: "",
  teams: {
    team1: { players: [], points: 0 },
    team2: { players: [], points: 0 },
    team3: { players: [], points: 0 },
    waiting: { players: initialPlayers, points: 0 },
  }
}

type GameStates = {
  [key: string]: GameState
}
let gameStates: GameStates = {}

// Define types for data if you want stricter structure
interface ClientData {
  userType: string
  timestamp: string
}

// Socket.IO connection handler
io.on("connection", (socket: Socket) => {
  console.log("⚡ Client connected:", socket.id)

  socket.on("initializePlayers", (data, callback) => {
    callback(gameStates[data.gameCode].teams)
  })

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
    }
    gameStates[data.gameCode].gameCode = data.gameCode
  })

  socket.on('setGameCode', (data) => {
    if (data.gameCode in gameStates) {
      gameStates[data.gameCode].gameCode = data.gameCode //kinda useless
    }
    else {
      gameStates[data.gameCode] = initialGameState
      gameStates[data.gameCode].gameCode = data.gameCode
    }
  })

  socket.on('getCompleteGameStateSenderOnly', (data) => {
    // return Game state to the sender only 
    // io.emit?
  })


  socket.on("playerJoinedGame", (data) => {
    const newPlayer: Player = data
    // Add player to waiting lists
    if (data.gameCode in gameStates) {
      gameStates[data.gameCode].teams.waiting.players.push(newPlayer)
      io.emit("playerAddedToWaitingList", gameStates[data.gameCode].teams)
    }
    else {
      console.log("We got problem houston. addPlayerToWaiting is working with empty gameCode.")
    }
  })


  socket.on("movePlayer", (data, callback) => {
    const teams = gameStates[data.gameCode].teams
    movePlayer(teams, data.playerId, data.fromTeam, data.toTeam)
    callback(teams)
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



  // Helper function to move a player between teams
  const movePlayer = (teams: Teams, playerId: string, fromTeam: keyof GameState['teams'], toTeam: keyof GameState['teams']) => {
    const maxPlayersPerTeam = 20

    // Find the player and teams
    const playerIndex = teams[fromTeam].players.findIndex((p) => p.id === playerId)
    if (playerIndex === -1) return

    const player = teams[fromTeam].players[playerIndex]
    const fromTeamPlayers = [...teams[fromTeam].players]
    const toTeamPlayers = teams[toTeam].players

    // Ensure we don't exceed the max players per team
    if (toTeamPlayers.length >= maxPlayersPerTeam) {
      console.log(`Team ${toTeam} is full`)
      return
    }

    // Remove player from the original team and add to the new team
    teams[fromTeam].players = fromTeamPlayers.splice(playerIndex, 1)
    teams[toTeam].players = [...toTeamPlayers, player]
  }
