const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    orderId: String,
    transactionId: String,
    amount: Number,
    phoneNumber: String,
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Payment", paymentSchema)
