const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET

// Register User
const registerUser = async (req, res) => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            image,
            phoneNumber
        } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email already in use" })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        )

        const newUser = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            image,
            phoneNumber
        })

        await newUser.save()

        const token = jwt.sign(
            { userId: newUser._id },
            JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(201).json({ token, user: newUser })
    } catch (error) {
        console.error("Error registering user:", error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        )
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(200).json({ token, user })
    } catch (error) {
        console.error("Error logging in:", error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = { registerUser, loginUser }
