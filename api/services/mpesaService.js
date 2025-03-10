const axios = require("axios")
const mpesaConfig = require("../config/mpesa.config")

class MpesaService {
    constructor() {
        if (
            !mpesaConfig.consumerKey ||
            !mpesaConfig.consumerSecret
        ) {
            throw new Error(
                "M-PESA credentials not configured"
            )
        }
    }

    async initiateSTKPush(phoneNumber, amount, orderId) {
        try {
            const accessToken = await this.getAccessToken()
            const timestamp = this.generateTimestamp()
            const password =
                this.generatePassword(timestamp)

            const response = await axios.post(
                "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
                {
                    BusinessShortCode:
                        mpesaConfig.shortCode,
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType:
                        "CustomerPayBillOnline",
                    Amount: Math.round(amount), 
                    PartyA: phoneNumber,
                    PartyB: mpesaConfig.shortCode,
                    PhoneNumber: phoneNumber,
                    CallBackURL: `${mpesaConfig.callbackUrl}/api/payment/callback`,
                    AccountReference: orderId,
                    TransactionDesc: "Court Booking Payment"
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            return response.data
        } catch (error) {
            console.error(
                "STK Push Error:",
                error.response?.data || error.message
            )
            throw error
        }
    }

    async getAccessToken() {
        try {
            const auth = Buffer.from(
                `${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`
            ).toString("base64")

            const response = await axios.get(
                "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
                {
                    headers: {
                        Authorization: `Basic ${auth}`
                    }
                }
            )

            return response.data.access_token
        } catch (error) {
            console.error(
                "Access Token Error:",
                error.response?.data || error.message
            )
            throw error
        }
    }

    generateTimestamp() {
        return new Date()
            .toISOString()
            .replace(/[^0-9]/g, "")
            .slice(0, -3)
    }

    generatePassword(timestamp) {
        const data = `${mpesaConfig.shortCode}${mpesaConfig.passKey}${timestamp}`
        return Buffer.from(data).toString("base64")
    }
}

module.exports = new MpesaService()
