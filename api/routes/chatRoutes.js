const express = require("express")
const router = express.Router()
const Message = require("../models/chatModel")
const Game = require("../models/gameModel")
const {
    sendPushNotification
} = require("../services/notificationService")

// Send a message
router.post("/send", async (req, res) => {
    try {
        const { gameId, senderId, content } = req.body

        const game = await Game.findById(gameId).populate(
            "players",
            "expoPushToken"
        )

        if (!game) {
            return res
                .status(404)
                .json({ message: "Game not found" })
        }

        const newMessage = new Message({
            sender: senderId,
            content,
            gameId
        })

        await newMessage.save()

        // Send push notifications to all players except sender
        const otherPlayers = game.players.filter(
            player => player._id.toString() !== senderId
        )

        for (const player of otherPlayers) {
            if (player.expoPushToken) {
                await sendPushNotification(
                    player.expoPushToken,
                    "New message in game chat",
                    content.substring(0, 50) +
                        (content.length > 50 ? "..." : "")
                )
            }
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.error("Error sending message:", error)
        res.status(500).json({
            message: "Failed to send message"
        })
    }
})

// Get chat messages for a game
router.get("/:gameId", async (req, res) => {
    try {
        const { gameId } = req.params
        const messages = await Message.find({ gameId })
            .populate("sender", "firstName lastName image")
            .sort({ timestamp: 1 })

        res.status(200).json(messages)
    } catch (error) {
        console.error("Error fetching messages:", error)
        res.status(500).json({
            message: "Failed to fetch messages"
        })
    }
})

module.exports = router
