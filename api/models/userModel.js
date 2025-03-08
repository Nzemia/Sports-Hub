const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String
        },
        image: {
            type: String,
            required: true
        },
        skill: {
            type: String
        },
        // phoneNumber: {
        //     type: String,
        //     unique: false,
        //     required: false
        // },
        otp: String,
        noOfGames: {
            type: Number,
            default: 0
        },
        playpals: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        onlineStatus: {
            type: String,
            enum: ["online", "offline"],
            default: "offline"
        },
        sports: [
            {
                type: String
            }
        ],
        reviews: [
            {
                reviewer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                rating: Number,
                comment: String,
                timestamp: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)

module.exports = User
