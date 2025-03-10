const express = require("express")
const router = express.Router()
const mpesaService = require("../services/mpesaService")
const Payment = require("../models/paymentModel")

router.post("/initiate", async (req, res) => {
    try {
        const { phoneNumber, amount, orderId } = req.body

        if (!phoneNumber || !amount || !orderId) {
            return res.status(400).json({
                message: "Missing required parameters"
            })
        }

        // Format phone number
        const formattedPhone = phoneNumber.startsWith("254")
            ? phoneNumber
            : `254${phoneNumber.replace(/^0/, "")}`

        // Validate phone number format
        if (!/^254[0-9]{9}$/.test(formattedPhone)) {
            return res.status(400).json({
                message:
                    "Invalid phone number format. Use format: 254XXXXXXXXX"
            })
        }

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
        console.error(
            "Payment initiation error:",
            error.response?.data || error
        )
        res.status(500).json({
            message: "Failed to initiate payment",
            error:
                error.response?.data?.errorMessage ||
                error.message
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
