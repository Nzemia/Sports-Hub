const express = require("express")
const router = express.Router()
const moment = require("moment")
const Game = require("../models/gameModel")
const {
    sendPushNotification
} = require("../services/notificationService")
const User = require("../models/userModel")

// Create a new game
router.post("/createGame", async (req, res) => {
    try {
        const {
            sport,
            area,
            date,
            admin,
            totalPlayers,
            isPublic
        } = req.body

        // Check if user already has a game on this date
        const existingGame = await Game.findOne({
            admin,
            sport,
            date,
            area
        })

        if (existingGame) {
            return res.status(400).json({
                message:
                    "You already have a similar game scheduled for this date"
            })
        }

        const newGame = new Game({
            sport,
            area,
            date,
            admin,
            totalPlayers,
            isPublic,
            players: [admin]
        })

        const savedGame = await newGame.save()

        // Get games sorted by creation date
        const games = await Game.find({})
            .sort({ createdAt: -1 })
            .populate("admin")
            .populate("players")

        res.status(201).json({
            message: "Game created successfully",
            games
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message:
                err.code === 11000
                    ? "Similar game already exists"
                    : "Failed to create game"
        })
    }
})

router.get("/", async (req, res) => {
    try {
        const { userId } = req.query
        const games = await Game.find({
            $or: [{ admin: userId }, { players: userId }]
        })
            .populate("admin")
            .populate("players", "image firstName lastName")

        const currentDate = moment()

        // Filter games based on current date only
        const filteredGames = games.filter(game => {
            const gameDate = moment(game.date, "Do MMMM")
            return (
                gameDate.isAfter(currentDate, "day") ||
                gameDate.isSame(currentDate, "day")
            )
        })

        const formattedGames = filteredGames.map(game => ({
            _id: game._id,
            sport: game.sport,
            date: game.date,
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
router.get("/upcoming/:userId", async (req, res) => {
    try {
        const userId = req.params.userId
        const games = await Game.find({
            $or: [{ admin: userId }, { players: userId }]
        })
            .populate("admin")
            .populate("players", "image firstName lastName")

        const currentDate = moment()

        // Filter upcoming games
        const upcomingGames = games.filter(game => {
            const gameDate = moment(game.date, "Do MMMM")
            return (
                gameDate.isAfter(currentDate, "day") ||
                gameDate.isSame(currentDate, "day")
            )
        })

        const formattedGames = upcomingGames.map(game => ({
            _id: game._id,
            sport: game.sport,
            date: game.date,
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
            isUserAdmin:
                game.admin._id.toString() === userId,
            adminUrl: game.admin ? game.admin.image : null,
            matchFull: game.matchFull
        }))

        res.json(formattedGames)
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
        const { userId, comment } = req.body
        const { gameId } = req.params

        const game = await Game.findById(gameId)

        if (!game) {
            return res
                .status(404)
                .json({ message: "Game not found" })
        }

        // Check if game is private and user is not invited
        if (
            !game.isPublic &&
            !game.invitedPlayers?.includes(userId)
        ) {
            return res.status(403).json({
                message:
                    "This is a private game. You need an invitation to join."
            })
        }

        // Check if the user has already requested to join the game
        const existingRequest = game.requests.find(
            request => request.userId.toString() === userId
        )
        if (existingRequest) {
            return res
                .status(400)
                .json({ message: "Request already sent" })
        }

        // Add the user's ID and comment to the requests array
        game.requests.push({ userId, comment })

        // Save the updated game document
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

// Get game requests with user information
router.get("/:gameId/requests", async (req, res) => {
    try {
        const { gameId } = req.params
        const game = await Game.findById(gameId).populate({
            path: "requests.userId",
            select: "email firstName lastName image skill noOfGames playpals sports"
        })

        if (!game) {
            return res
                .status(404)
                .json({ message: "Game not found" })
        }

        const requestsWithUserInfo = game.requests.map(
            request => ({
                userId: request.userId._id,
                email: request.userId.email,
                firstName: request.userId.firstName,
                lastName: request.userId.lastName,
                image: request.userId.image,
                skill: request.userId.skill,
                noOfGames: request.userId.noOfGames,
                playpals: request.userId.playpals,
                sports: request.userId.sports,
                comment: request.comment
            })
        )

        res.json(requestsWithUserInfo)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Failed to fetch requests"
        })
    }
})

// Accept player request
router.post("/accept", async (req, res) => {
    try {
        const { gameId, userId } = req.body

        // Find the game and user
        const game = await Game.findById(gameId)
        const user = await User.findById(userId)

        if (!game || !user) {
            return res
                .status(404)
                .json({ message: "Game or user not found" })
        }

        // Add user to players
        game.players.push(userId)

        // Remove from requests
        await Game.findByIdAndUpdate(gameId, {
            $pull: { requests: { userId: userId } }
        })

        await game.save()

        // Send push notification if user has a token
        if (user.expoPushToken) {
            await sendPushNotification(
                user.expoPushToken,
                "Request Accepted!",
                "Your request to join the game has been accepted. Get ready to play!"
            )
        }

        res.status(200).json({
            message: "Request accepted",
            game
        })
    } catch (error) {
        console.error(error)
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

        if (!game) {
            return res
                .status(404)
                .json({ message: "Game not found" })
        }

        res.status(200).json(game.players)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Failed to fetch players"
        })
    }
})

// Toggle match full status
router.post("/toggle-match-full", async (req, res) => {
    try {
        const { gameId } = req.body

        // Find the game by its ID
        const game = await Game.findById(gameId)
        if (!game) {
            return res
                .status(404)
                .json({ message: "Game not found" })
        }

        // Toggle the matchFull status
        game.matchFull = !game.matchFull
        await game.save()

        res.json({
            message: "Match full status updated",
            matchFull: game.matchFull
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Failed to update match full status"
        })
    }
})

module.exports = router
