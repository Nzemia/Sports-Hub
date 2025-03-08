const express = require("express")
const {
    registerUser,
    loginUser,
    getUserById
} = require("../controllers/authController")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/user/:userId", getUserById)

router.post("/update-token", async (req, res) => {
    try {
        const { userId, expoPushToken } = req.body

        await User.findByIdAndUpdate(userId, {
            expoPushToken: expoPushToken
        })

        res.status(200).json({
            message: "Token updated successfully"
        })
    } catch (error) {
        console.error("Failed to update token:", error)
        res.status(500).json({
            message: "Failed to update token"
        })
    }
})

module.exports = router
