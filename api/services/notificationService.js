const axios = require("axios")

const sendPushNotification = async (
    expoPushToken,
    title,
    body
) => {
    const message = {
        to: expoPushToken,
        sound: "default",
        title: title,
        body: body,
        data: { someData: "goes here" }
    }

    try {
        await axios.post(
            "https://exp.host/--/api/v2/push/send",
            message,
            {
                headers: {
                    Accept: "application/json",
                    "Accept-encoding": "gzip, deflate",
                    "Content-Type": "application/json"
                }
            }
        )
    } catch (error) {
        console.error("Error sending notification:", error)
    }
}

module.exports = { sendPushNotification }
