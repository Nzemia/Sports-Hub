const express = require("express")
const router = express.Router()
const mpesaService = require("../services/mpesaService")
const Payment = require("../models/paymentModel")

const formatPhoneNumber = phoneNumber => {
    // Remove any spaces, hyphens or other characters
    let cleaned = phoneNumber.replace(/[^0-9]/g, "")

    // If starts with +254, remove the +
    if (cleaned.startsWith("254")) {
        return cleaned
    }

    // If starts with 0 (07... or 01...), remove 0 and add 254
    if (cleaned.startsWith("0")) {
        return `254${cleaned.slice(1)}`
    }

    // If starts with 7 or 1, add 254
    if (
        cleaned.startsWith("7") ||
        cleaned.startsWith("1")
    ) {
        return `254${cleaned}`
    }

    return cleaned
}

const isValidPhoneNumber = phoneNumber => {
    // Matches:
    // 254710123456 (12 digits with 254)
    // 0710123456 (10 digits starting with 0)
    // 0110123456 (10 digits starting with 0)
    // 710123456 (9 digits starting with 7)
    // 110123456 (9 digits starting with 1)
    const regex = /^(?:254|0)?[17][0-9]{8}$/
    return regex.test(phoneNumber)
}

router.post("/initiate", async (req, res) => {
    try {
        const { phoneNumber, amount, orderId } = req.body

        if (!phoneNumber || !amount || !orderId) {
            return res.status(400).json({
                message: "Missing required parameters"
            })
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            return res.status(400).json({
                message:
                    "Invalid phone number. Please use a valid Safaricom number (07XX, 01XX, or 254XXX format)"
            })
        }

        const formattedPhone =
            formatPhoneNumber(phoneNumber)

        const response = await mpesaService.initiateSTKPush(
            formattedPhone,
            amount,
            orderId
        )

        if (response.ResponseCode === "0") {
            res.status(200).json({
                message: "Payment initiated successfully",
                checkoutRequestID:
                    response.CheckoutRequestID
            })
        } else {
            res.status(400).json({
                message:
                    response.ResponseDescription ||
                    "Payment initiation failed"
            })
        }
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
