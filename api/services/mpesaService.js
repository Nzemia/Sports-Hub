const axios = require("axios")
const mpesaConfig = require("../config/mpesa.config")

class MpesaService {
    constructor() {
        this.baseUrl =
            mpesaConfig.environment === "production"
                ? "https://api.safaricom.co.ke"
                : "https://sandbox.safaricom.co.ke"
    }

    async getAccessToken() {
        const auth = Buffer.from(
            `${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`
        ).toString("base64")
        try {
            const response = await axios.get(
                `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
                {
                    headers: {
                        Authorization: `Basic ${auth}`
                    }
                }
            )
            return response.data.access_token
        } catch (error) {
            console.error(
                "Error getting access token:",
                error
            )
            throw error
        }
    }

    async initiateSTKPush(phoneNumber, amount, orderId) {
        try {
            const accessToken = await this.getAccessToken()
            const timestamp = this.generateTimestamp()
            const password =
                this.generatePassword(timestamp)

            const response = await axios.post(
                `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
                {
                    BusinessShortCode:
                        mpesaConfig.shortCode,
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType:
                        "CustomerPayBillOnline",
                    Amount: amount,
                    PartyA: phoneNumber,
                    PartyB: mpesaConfig.shortCode,
                    PhoneNumber: phoneNumber,
                    CallBackURL: `${mpesaConfig.callbackUrl}/api/payment/callback`,
                    AccountReference: orderId,
                    TransactionDesc: "Court Booking Payment"
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )

            return response.data
        } catch (error) {
            console.error(
                "Error initiating STK push:",
                error
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
