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
router.get("/upcoming/:userId", async (req, res) => {
    try {
        const userId = req.params.userId
        const games = await Game.find({
            $or: [{ admin: userId }, { players: userId }]
        })
            .populate("admin")
            .populate("players", "image firstName lastName")

        const formattedGames = games.map(game => ({
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

        console.log("user", userId)
        console.log("heyy", gameId)

        // Find the game
        const game = await Game.findById(gameId)
        if (!game) {
            return res
                .status(404)
                .json({ message: "Game not found" })
        }

        // Add user to players array
        game.players.push(userId)

        // Remove the user from requests array using $pull operator
        await Game.findByIdAndUpdate(
            gameId,
            {
                $pull: { requests: { userId: userId } }
            },
            { new: true }
        )

        await game.save()

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
