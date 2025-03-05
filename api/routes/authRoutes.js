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

module.exports = router
