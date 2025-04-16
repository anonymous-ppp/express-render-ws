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
const wordSets = [
    ["Apple", "Mountain", "Ocean", "Book", "Guitar"],
    ["Pizza", "Elephant", "Sunshine", "Computer", "Bicycle"],
    ["Coffee", "Airplane", "Rainbow", "Camera", "Basketball"],
    ["Chocolate", "Train", "Flower", "Television", "Umbrella"],
    ["Banana", "Castle", "Star", "Telephone", "Backpack"],
    ["Hamburger", "Dolphin", "Moon", "Keyboard", "Skateboard"],
    ["Cake", "Helicopter", "Cloud", "Microphone", "Tennis"],
    ["Ice Cream", "Lion", "Lightning", "Printer", "Surfboard"],
    ["Pasta", "Penguin", "Sunset", "Headphones", "Soccer"],
    ["Cookie", "Submarine", "Planet", "Speaker", "Rollerblades"],
    ["Sandwich", "Giraffe", "Waterfall", "Tablet", "Baseball"],
    ["Donut", "Spaceship", "Volcano", "Watch", "Football"],
    ["Salad", "Turtle", "Tornado", "Projector", "Hockey"],
    ["Pancake", "Dinosaur", "Constellation", "Smartphone", "Volleyball"],
    ["Taco", "Octopus", "Aurora", "Calculator", "Frisbee"],
];
const initialPlayers = [
    { id: "1", name: "Example player" },
];
let gameStates = {};
//uncomment to add default test data
// gameStates['758635'] = {"gameCode":"758635","host":"J","teams":{"team1":{"players":[{"id":"mpxvp77j2","name":"X"}],"points":0, teamName:"Team 1"},"team2":{"players":[{"id":"k1uhntn4b","name":"qq"}],"points":0, teamName:"Team 2"},"team3":{"players":[{"id":"79c1d78nw","name":"m4ry"}],"points":0,teamName:"Team 3"},"waiting":{teamName:"waitingTeam","players":[{"id":"1","name":"Example player"}],"points":0}},"rounds":[{"wordList":["Apple","Mountain","Ocean","Book","Guitar"],"wordToGuess":"Guitar"},{"wordList":["Pizza","Elephant","Sunshine","Computer","Bicycle"],"wordToGuess":"Sunshine"},{"wordList":["Coffee","Airplane","Rainbow","Camera","Basketball"],"wordToGuess":"Airplane"},{"wordList":["Chocolate","Train","Flower","Television","Umbrella"],"wordToGuess":"Flower"},{"wordList":["Banana","Castle","Star","Telephone","Backpack"],"wordToGuess":"Castle"},{"wordList":["Hamburger","Dolphin","Moon","Keyboard","Skateboard"],"wordToGuess":"Moon"},{"wordList":["Cake","Helicopter","Cloud","Microphone","Tennis"],"wordToGuess":"Microphone"},{"wordList":["Ice Cream","Lion","Lightning","Printer","Surfboard"],"wordToGuess":"Printer"},{"wordList":["Pasta","Penguin","Sunset","Headphones","Soccer"],"wordToGuess":"Pasta"},{"wordList":["Cookie","Submarine","Planet","Speaker","Rollerblades"],"wordToGuess":"Speaker"},{"wordList":["Sandwich","Giraffe","Waterfall","Tablet","Baseball"],"wordToGuess":"Giraffe"},{"wordList":["Donut","Spaceship","Volcano","Watch","Football"],"wordToGuess":"Watch"},{"wordList":["Salad","Turtle","Tornado","Projector","Hockey"],"wordToGuess":"Tornado"},{"wordList":["Pancake","Dinosaur","Constellation","Smartphone","Volleyball"],"wordToGuess":"Constellation"},{"wordList":["Taco","Octopus","Aurora","Calculator","Frisbee"],"wordToGuess":"Taco"}]}
gameStates['285478'] = { "gameCode": "285478", "host": "J", "teams": { "team1": { "players": [{ "id": "0yi4ni2pf", "name": "qq" }, { "id": "vnuxrqs1g", "name": "q" }], "points": 0, "teamName": "Team 1" }, "team2": { "players": [{ "id": "g3z8ryygt", "name": "X" }, { "id": "4hgi6cep0", "name": "a" }], "points": 0, "teamName": "Team 2" }, "team3": { "players": [{ "id": "yjfn758qx", "name": "jj" }, { "id": "7zbioy5tv", "name": "b" }], "points": 0, "teamName": "Team 3" }, "waiting": { "players": [{ "id": "1", "name": "Example player" }], "points": 0, "teamName": "waiting Team " } }, "rounds": [{ "wordList": ["Apple", "Mountain", "Ocean", "Book", "Guitar"], "wordToGuess": "Book", "roundNumber": 1, "guesserId": "vnuxrqs1g", "guesserName": "q", "team": { "players": [{ "id": "0yi4ni2pf", "name": "qq" }, { "id": "vnuxrqs1g", "name": "q" }], "points": 0, "teamName": "Team 1" } }, { "wordList": ["Pizza", "Elephant", "Sunshine", "Computer", "Bicycle"], "wordToGuess": "Bicycle" }, { "wordList": ["Coffee", "Airplane", "Rainbow", "Camera", "Basketball"], "wordToGuess": "Rainbow" }, { "wordList": ["Chocolate", "Train", "Flower", "Television", "Umbrella"], "wordToGuess": "Chocolate" }, { "wordList": ["Banana", "Castle", "Star", "Telephone", "Backpack"], "wordToGuess": "Star" }, { "wordList": ["Hamburger", "Dolphin", "Moon", "Keyboard", "Skateboard"], "wordToGuess": "Dolphin" }, { "wordList": ["Cake", "Helicopter", "Cloud", "Microphone", "Tennis"], "wordToGuess": "Microphone" }, { "wordList": ["Ice Cream", "Lion", "Lightning", "Printer", "Surfboard"], "wordToGuess": "Printer" }, { "wordList": ["Pasta", "Penguin", "Sunset", "Headphones", "Soccer"], "wordToGuess": "Sunset" }, { "wordList": ["Cookie", "Submarine", "Planet", "Speaker", "Rollerblades"], "wordToGuess": "Planet" }, { "wordList": ["Sandwich", "Giraffe", "Waterfall", "Tablet", "Baseball"], "wordToGuess": "Baseball" }, { "wordList": ["Donut", "Spaceship", "Volcano", "Watch", "Football"], "wordToGuess": "Football" }, { "wordList": ["Salad", "Turtle", "Tornado", "Projector", "Hockey"], "wordToGuess": "Projector" }, { "wordList": ["Pancake", "Dinosaur", "Constellation", "Smartphone", "Volleyball"], "wordToGuess": "Constellation" }, { "wordList": ["Taco", "Octopus", "Aurora", "Calculator", "Frisbee"], "wordToGuess": "Aurora" }], "roundNumber": 2 };
// gameStates['162480'] = {"gameCode":"162480","host":"J","teams":{"team1":{"players":[{"id":"4nvg84mik","name":"w"},{"id":"tu5bxq7f9","name":"z"},{"id":"uilgiljjq","name":"op"}],"points":0,"teamName":"Team 1"},"team2":{"players":[{"id":"4r7ymfkfk","name":"r"},{"id":"46m2dixgs","name":"b"},{"id":"f7htesky6","name":"das"},{"id":"wsisfdwbs","name":"lok"}],"points":0,"teamName":"Team 2"},"team3":{"players":[{"id":"wum1k5lai","name":"e"},{"id":"jmew4qqev","name":"k"},{"id":"jyuhsfmzo","name":"man"}],"points":0,"teamName":"Team 3"},"waiting":{"players":[{"id":"1","name":"Example player"}],"points":0,"teamName":"waiting Team "}},"rounds":[{"wordList":["Apple","Mountain","Ocean","Book","Guitar"],"wordToGuess":"Book","roundNumber":1,"guesserId":"4nvg84mik","guesserName":"w","team":{"players":[{"id":"4nvg84mik","name":"w"},{"id":"tu5bxq7f9","name":"z"},{"id":"uilgiljjq","name":"op"}],"points":0,"teamName":"Team 1"}},{"wordList":["Pizza","Elephant","Sunshine","Computer","Bicycle"],"wordToGuess":"Computer"},{"wordList":["Coffee","Airplane","Rainbow","Camera","Basketball"],"wordToGuess":"Coffee"},{"wordList":["Chocolate","Train","Flower","Television","Umbrella"],"wordToGuess":"Chocolate"},{"wordList":["Banana","Castle","Star","Telephone","Backpack"],"wordToGuess":"Backpack"},{"wordList":["Hamburger","Dolphin","Moon","Keyboard","Skateboard"],"wordToGuess":"Hamburger"},{"wordList":["Cake","Helicopter","Cloud","Microphone","Tennis"],"wordToGuess":"Helicopter"},{"wordList":["Ice Cream","Lion","Lightning","Printer","Surfboard"],"wordToGuess":"Lightning"},{"wordList":["Pasta","Penguin","Sunset","Headphones","Soccer"],"wordToGuess":"Pasta"},{"wordList":["Cookie","Submarine","Planet","Speaker","Rollerblades"],"wordToGuess":"Speaker"},{"wordList":["Sandwich","Giraffe","Waterfall","Tablet","Baseball"],"wordToGuess":"Tablet"},{"wordList":["Donut","Spaceship","Volcano","Watch","Football"],"wordToGuess":"Spaceship"},{"wordList":["Salad","Turtle","Tornado","Projector","Hockey"],"wordToGuess":"Projector"},{"wordList":["Pancake","Dinosaur","Constellation","Smartphone","Volleyball"],"wordToGuess":"Smartphone"},{"wordList":["Taco","Octopus","Aurora","Calculator","Frisbee"],"wordToGuess":"Taco"}],"roundNumber":1}
gameStates['162480'] = { "gameCode": "162480", "host": "J", "teams": { "team1": { "players": [{ "id": "4nvg84mik", "name": "w" }, { "id": "tu5bxq7f9", "name": "z" }, { "id": "uilgiljjq", "name": "op" }], "points": 4, "teamName": "Team 1" }, "team2": { "players": [{ "id": "4r7ymfkfk", "name": "r" }, { "id": "46m2dixgs", "name": "b" }, { "id": "f7htesky6", "name": "das" }, { "id": "wsisfdwbs", "name": "lok" }], "points": 4, "teamName": "Team 2" }, "team3": { "players": [{ "id": "wum1k5lai", "name": "e" }, { "id": "jmew4qqev", "name": "k" }, { "id": "jyuhsfmzo", "name": "man" }], "points": 4, "teamName": "Team 3" }, "waiting": { "players": [{ "id": "1", "name": "Example player" }], "points": 0, "teamName": "waiting Team " } }, "rounds": [{ "wordList": ["Apple", "Mountain", "Ocean", "Book", "Guitar"], "wordToGuess": "Book", "roundNumber": 1, "guesserId": "4nvg84mik", "guesserName": "w", "team": { "players": [{ "id": "4nvg84mik", "name": "w" }, { "id": "tu5bxq7f9", "name": "z" }, { "id": "uilgiljjq", "name": "op" }], "points": 0, "teamName": "Team 1" } }, { "wordList": ["Pizza", "Elephant", "Sunshine", "Computer", "Bicycle"], "wordToGuess": "Computer" }, { "wordList": ["Coffee", "Airplane", "Rainbow", "Camera", "Basketball"], "wordToGuess": "Coffee" }, { "wordList": ["Chocolate", "Train", "Flower", "Television", "Umbrella"], "wordToGuess": "Chocolate" }, { "wordList": ["Banana", "Castle", "Star", "Telephone", "Backpack"], "wordToGuess": "Backpack" }, { "wordList": ["Hamburger", "Dolphin", "Moon", "Keyboard", "Skateboard"], "wordToGuess": "Hamburger" }, { "wordList": ["Cake", "Helicopter", "Cloud", "Microphone", "Tennis"], "wordToGuess": "Helicopter" }, { "wordList": ["Ice Cream", "Lion", "Lightning", "Printer", "Surfboard"], "wordToGuess": "Lightning" }, { "wordList": ["Pasta", "Penguin", "Sunset", "Headphones", "Soccer"], "wordToGuess": "Pasta" }, { "wordList": ["Cookie", "Submarine", "Planet", "Speaker", "Rollerblades"], "wordToGuess": "Speaker" }, { "wordList": ["Sandwich", "Giraffe", "Waterfall", "Tablet", "Baseball"], "wordToGuess": "Tablet" }, { "wordList": ["Donut", "Spaceship", "Volcano", "Watch", "Football"], "wordToGuess": "Spaceship" }, { "wordList": ["Salad", "Turtle", "Tornado", "Projector", "Hockey"], "wordToGuess": "Projector" }, { "wordList": ["Pancake", "Dinosaur", "Constellation", "Smartphone", "Volleyball"], "wordToGuess": "Smartphone" }, { "wordList": ["Taco", "Octopus", "Aurora", "Calculator", "Frisbee"], "wordToGuess": "Taco" }], "roundNumber": 1 };
const setRandomWordToGuess = (rounds) => {
    rounds.forEach(round => {
        round.wordToGuess = round.wordList[Math.floor(Math.random() * round.wordList.length)];
    });
};
// Socket.IO connection handler
io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);
    socket.on("initializeWaitingRoom", (data, callback) => {
        const gameState = gameStates[data.gameCode];
        callback({ teams: gameState.teams, hostName: gameState.host });
    });
    socket.on('initializeGameCode', (data) => {
        gameStates[data.gameCode] = {
            gameCode: data.gameCode,
            host: data.hostName,
            teams: {
                team1: { players: [], points: 0, teamName: "Team 1" },
                team2: { players: [], points: 0, teamName: "Team 2" },
                team3: { players: [], points: 0, teamName: "Team 3" },
                waiting: { players: [{ id: "1", name: "Example player" }], points: 0, teamName: "waiting Team " },
            },
            // roundNumber:,
            rounds: [
                {
                    wordList: ["Apple", "Mountain", "Ocean", "Book", "Guitar"],
                },
                {
                    wordList: ["Pizza", "Elephant", "Sunshine", "Computer", "Bicycle"],
                },
                {
                    wordList: ["Coffee", "Airplane", "Rainbow", "Camera", "Basketball"],
                },
                {
                    wordList: ["Chocolate", "Train", "Flower", "Television", "Umbrella"],
                },
                {
                    wordList: ["Banana", "Castle", "Star", "Telephone", "Backpack"],
                },
                {
                    wordList: ["Hamburger", "Dolphin", "Moon", "Keyboard", "Skateboard"],
                },
                {
                    wordList: ["Cake", "Helicopter", "Cloud", "Microphone", "Tennis"],
                },
                {
                    wordList: ["Ice Cream", "Lion", "Lightning", "Printer", "Surfboard"],
                },
                {
                    wordList: ["Pasta", "Penguin", "Sunset", "Headphones", "Soccer"],
                },
                {
                    wordList: ["Cookie", "Submarine", "Planet", "Speaker", "Rollerblades"],
                },
                {
                    wordList: ["Sandwich", "Giraffe", "Waterfall", "Tablet", "Baseball"],
                },
                {
                    wordList: ["Donut", "Spaceship", "Volcano", "Watch", "Football"],
                },
                {
                    wordList: ["Salad", "Turtle", "Tornado", "Projector", "Hockey"],
                },
                {
                    wordList: ["Pancake", "Dinosaur", "Constellation", "Smartphone", "Volleyball"],
                },
                {
                    wordList: ["Taco", "Octopus", "Aurora", "Calculator", "Frisbee"],
                },
            ]
        };
        setRandomWordToGuess(gameStates[data.gameCode].rounds); // updated by reference
    });
    socket.on('setGameCode', (data) => {
        if (data.gameCode in gameStates) {
            gameStates[data.gameCode].gameCode = data.gameCode; //kinda useless
        }
        else {
            gameStates[data.gameCode].gameCode = data.gameCode;
        }
    });
    socket.on("playerJoinedGame", (data) => {
        const { gamecode, newPlayer } = data;
        // Add player to waiting lists
        if (gamecode in gameStates) {
            const players = gameStates[gamecode].teams.waiting.players;
            if (!players.some(p => p.id === newPlayer.id)) {
                players.push(newPlayer);
            }
            io.emit("playerAddedToWaitingList", gameStates[gamecode].teams);
        }
        else {
            console.log("We got problem houston. addPlayerToWaiting is working with empty gameCode.");
        }
    });
    socket.on("movePlayer", (data, callback) => {
        const teams = gameStates[data.gamecode].teams;
        movePlayer(teams, data.playerId, data.fromTeam, data.toTeam);
        socket.broadcast.emit("refreshTeams", { teams });
        callback(teams);
    });
    socket.on("getScores", (data, callback) => {
        const { gamecode } = data;
        callback({ teams: gameStates[gamecode].teams });
    });
    socket.on("updateTeamScore", (data, callback) => {
        const { roundNumber, gamecode, finalGuess } = data;
        const gameState = gameStates[gamecode];
        const round = gameState.rounds[roundNumber - 1];
        const isCorrect = finalGuess == round.wordToGuess;
        if (round.team && isCorrect) {
            round.team.points = round.team.points + 1;
        }
        callback({ isCorrect });
    });
    socket.on("hostStartedGame", (data) => {
        // Set round number = 0 
        gameStates[data.gamecode].roundNumber = 0;
        socket.broadcast.emit("gameStarted");
    });
    socket.on('hostInitializeRound', (data, callback) => {
        const { gamecode, roundNumber } = data;
        const gameState = gameStates[gamecode];
        if (gameState.roundNumber != null) {
            gameState.roundNumber = Number(roundNumber);
        }
        callback({ roundNumber: gameState.roundNumber });
    });
    socket.on('hostInitializeRound-setPlayingTeam', (data, callback) => {
        const teamName = data.teamName;
        const gameState = gameStates[data.gamecode];
        const roundNumber = Number(gameState.roundNumber);
        const round = gameState.rounds[roundNumber - 1];
        round.roundNumber = roundNumber;
        const players = gameState.teams[teamName].players;
        const guesser = players[Math.floor(Math.random() * players.length)];
        round.guesserId = guesser.id;
        round.guesserName = guesser.name;
        round.team = gameState.teams[teamName];
        socket.broadcast.emit("player-loadRound", { roundNumber, round: round, team: round.team, teamName: data.teamName, guesser });
        // console.log(JSON.stringify(gameState))
        callback({ wordToGuess: round.wordToGuess, guesser, team: round.team, wordSet: round.wordList });
    });
    socket.on('host-startGuessPhase', (data) => {
        const { gamecode, roundNumber, clues } = data;
        // maybe best to use namespaces
        const wordList = gameStates[gamecode].rounds[roundNumber - 1].wordList;
        socket.broadcast.emit("guesser-enableGuessing", { wordList, roundNumber, clues });
    });
    socket.on('guesser-submitGuess', (data) => {
        const { gamecode, roundNumber, playerId, guess } = data;
        // maybe best to use namespaces
        socket.broadcast.emit("guesserSelectedAnswer", { gamecode, playerId, roundNumber, finalGuess: guess });
    });
    socket.on('host-roundEnding', (data) => {
        socket.broadcast.emit("roundEnding-forPlayers");
    });
    socket.on('host-getSubmittedClues', (data, callback) => {
        var _a, _b;
        const { gamecode } = data;
        const gameState = gameStates[gamecode];
        const roundNumber = (_a = gameState === null || gameState === void 0 ? void 0 : gameState.roundNumber) !== null && _a !== void 0 ? _a : -1; // This will crash when gameState or roundNumber is null
        // console.log('host-getsubmittedClues', {clues: gameState.rounds[roundNumber-1].clues ?? []})
        callback({ clues: (_b = gameState.rounds[roundNumber - 1].clues) !== null && _b !== void 0 ? _b : [] });
    });
    socket.on('player-submitClue', (data) => {
        var _a, _b;
        const gameState = gameStates[data.gamecode];
        const playerId = data.playerId;
        const clue = data.clue;
        if (gameState.roundNumber) {
            const round = gameState.rounds[gameState.roundNumber - 1];
            const playerClue = {
                playerId: playerId,
                clue: clue
            };
            if (round.clues) {
                if (round.clues.filter(c => c.playerId == playerId).length == 0) // avoid duplication playerIds
                 {
                    round.clues.push(playerClue);
                }
            }
            else {
                round.clues = [playerClue];
            }
            if (round.clues.length === ((_b = (_a = round.team) === null || _a === void 0 ? void 0 : _a.players.length) !== null && _b !== void 0 ? _b : -1) - 1) {
                socket.broadcast.emit("shortcircuit-guesstimer", {});
            }
            // console.log({ clues: round.clues })
        }
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
    const fromTeamPlayers = teams[fromTeam].players; // Directly reference the original players
    const toTeamPlayers = teams[toTeam].players; // Directly reference the original players
    // Ensure we don't exceed the max players per team
    if (toTeamPlayers.length >= maxPlayersPerTeam) {
        console.log(`Team ${toTeam} is full`);
        return;
    }
    // Remove player from the original team and add to the new team
    fromTeamPlayers.splice(playerIndex, 1);
    toTeamPlayers.push(player);
    // Now update the teams object directly
    teams[fromTeam].players = fromTeamPlayers;
    teams[toTeam].players = toTeamPlayers;
    // Return the updated teams object to be used in state update
    return teams;
};
