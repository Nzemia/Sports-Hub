const express = require("express")
const router = express.Router()
const {
    check,
    validationResult
} = require("express-validator")
const moment = require("moment")
const Game = require("../models/gameModel")
const authMiddleware = require("../middleware/authMiddleware")

// Create a new game
router.post(
    "/create",
    authMiddleware,
    [
        check("sport", "Sport is required").not().isEmpty(),
        check("area", "Area is required").not().isEmpty(),
        check("date", "Valid date is required").isDate(),
        check("time", "Time is required").not().isEmpty(),
        check(
            "totalPlayers",
            "Total players must be a number"
        ).isNumeric()
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ errors: errors.array() })
        }

        try {
            const {
                sport,
                area,
                date,
                time,
                totalPlayers
            } = req.body
            const admin = req.user.id

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
    }
)

// Fetch all upcoming games
router.get("/", async (req, res) => {
    try {
        const games = await Game.find({})
            .populate("admin")
            .populate("players", "image firstName lastName")

        const currentDate = moment()
        const filteredGames = games.filter(game => {
            const gameDateTime = moment(
                `${game.date} ${game.time}`,
                "YYYY-MM-DD HH:mm"
            )
            return gameDateTime.isAfter(currentDate)
        })

        res.json(filteredGames)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Failed to fetch games"
        })
    }
})

// Fetch user's upcoming games
router.get(
    "/upcoming",
    authMiddleware,
    async (req, res) => {
        try {
            const userId = req.user.id
            const games = await Game.find({
                $or: [
                    { admin: userId },
                    { players: userId }
                ]
            })
                .populate("admin")
                .populate(
                    "players",
                    "image firstName lastName"
                )

            res.json(games)
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: "Failed to fetch upcoming games"
            })
        }
    }
)

// Request to join a game
router.post(
    "/:gameId/request",
    authMiddleware,
    async (req, res) => {
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
    }
)

// Accept player request
router.post("/accept", authMiddleware, async (req, res) => {
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
