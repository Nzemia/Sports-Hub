const express = require("express")
const router = express.Router()
const mpesaService = require("../services/mpesaService")
const Payment = require("../models/paymentModel")

router.post("/initiate", async (req, res) => {
    try {
        const { phoneNumber, amount, orderId } = req.body

        // Validate phone number format (should be 254XXXXXXXXX)
        const formattedPhone = phoneNumber.startsWith("254")
            ? phoneNumber
            : `254${phoneNumber.substring(
                  phoneNumber.length - 9
              )}`

        const response = await mpesaService.initiateSTKPush(
            formattedPhone,
            amount,
            orderId
        )

        res.status(200).json({
            message: "STK push initiated",
            checkoutRequestID: response.CheckoutRequestID
        })
    } catch (error) {
        console.error("Payment initiation error:", error)
        res.status(500).json({
            message: "Failed to initiate payment"
        })
    }
})

router.post("/callback", async (req, res) => {
    try {
        const { Body } = req.body

        if (Body.stkCallback.ResultCode === 0) {
            // Payment successful
            const payment = new Payment({
                orderId: Body.stkCallback.BillRefNumber,
                transactionId:
                    Body.stkCallback.CheckoutRequestID,
                amount: Body.stkCallback.CallbackMetadata.Item.find(
                    item => item.Name === "Amount"
                ).Value,
                phoneNumber:
                    Body.stkCallback.CallbackMetadata.Item.find(
                        item => item.Name === "PhoneNumber"
                    ).Value,
                status: "completed"
            })

            await payment.save()
        }

        res.status(200).json({
            message: "Callback processed"
        })
    } catch (error) {
        console.error("Callback processing error:", error)
        res.status(500).json({
            message: "Failed to process callback"
        })
    }
})

module.exports = router
