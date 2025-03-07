const express = require("express")
const router = express.Router()
const moment = require("moment")
const Game = require("../models/gameModel")

// Create a new game
router.post("/createGame", async (req, res) => {
    try {
        const {
            sport,
            area,
            date,
            time,
            admin,
            totalPlayers
        } = req.body
        // const admin = req.user.id

        const newGame = new Game({
            sport,
            area,
            date,
            time,
            admin,
            totalPlayers,
            players: [admin]
        })
        const savedGame = await newGame.save()
        res.status(201).json(savedGame)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Failed to create game"
        })
    }
})

router.get("/", async (req, res) => {
    try {
        const games = await Game.find({})
            .populate("admin")
            .populate("players", "image firstName lastName")

        const currentDate = moment()

        // Filter games based on current date and time
        const filteredGames = games.filter(game => {
            const gameDate = moment(game.date, "Do MMMM")

            //console.log("game Date", gameDate)
            const gameTime = game.time.split(" - ")[0]
            console.log("game time", gameTime)
            const gameDateTime = moment(
                `${gameDate.format(
                    "YYYY-MM-DD"
                )} ${gameTime}`,
                "YYYY-MM-DD h:mm A"
            )

            //console.log("gameDateTime", gameDateTime)

            return gameDateTime.isAfter(currentDate)
        })

        const formattedGames = filteredGames.map(game => ({
            _id: game._id,
            sport: game.sport,
            date: game.date,
            time: game.time,
            area: game.area,
            players: game.players
                .filter(player => player)
                .map(player => ({
                    _id: player._id,
                    imageUrl: player.image,
                    name: `${player.firstName} ${player.lastName}`
                })),
            totalPlayers: game.totalPlayers,
            queries: game.queries,
            requests: game.requests,
            isBooked: game.isBooked,
            adminName: game.admin
                ? `${game.admin.firstName} ${game.admin.lastName}`
                : "Unknown",
            adminUrl: game.admin ? game.admin.image : null,
            matchFull: game.matchFull
        }))
        res.json(formattedGames)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Failed to fetch games"
        })
    }
})

// Fetch user's upcoming games
router.get("/upcoming", async (req, res) => {
    try {
        const userId = req.user.id
        const games = await Game.find({
            $or: [{ admin: userId }, { players: userId }]
        })
            .populate("admin")
            .populate("players", "image firstName lastName")

        res.json(games)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Failed to fetch upcoming games"
        })
    }
})

// Request to join a game
router.post("/:gameId/request", async (req, res) => {
    try {
        const { comment } = req.body
        const { gameId } = req.params
        const userId = req.user.id

        const game = await Game.findById(gameId)
        if (!game)
            return res
                .status(404)
                .json({ message: "Game not found" })

        if (
            game.requests.some(
                request =>
                    request.userId.toString() === userId
            )
        ) {
            return res.status(400).json({
                message: "Request already sent"
            })
        }

        game.requests.push({ userId, comment })
        await game.save()
        res.status(200).json({
            message: "Request sent successfully"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Failed to send request"
        })
    }
})

// Accept player request
router.post("/accept", async (req, res) => {
    try {
        const { gameId, userId } = req.body
        const game = await Game.findById(gameId)
        if (!game)
            return res
                .status(404)
                .json({ message: "Game not found" })

        if (game.players.includes(userId)) {
            return res.status(400).json({
                message: "User is already in the game"
            })
        }

        if (game.players.length >= game.totalPlayers) {
            return res
                .status(400)
                .json({ message: "Game is full" })
        }

        game.players.push(userId)
        game.requests = game.requests.filter(
            request => request.userId.toString() !== userId
        )
        await game.save()
        res.status(200).json({
            message: "Request accepted"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

// Get players of a game
router.get("/:gameId/players", async (req, res) => {
    try {
        const { gameId } = req.params
        const game = await Game.findById(gameId).populate(
            "players"
        )
        if (!game)
            return res
                .status(404)
                .json({ message: "Game not found" })
        res.status(200).json(game.players)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Failed to fetch players"
        })
    }
})

module.exports = router
