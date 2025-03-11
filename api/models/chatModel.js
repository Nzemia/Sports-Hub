const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Message", messageSchema)
