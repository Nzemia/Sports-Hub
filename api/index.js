const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const gameRoutes = require("./routes/gameRoutes")
const venueRoutes = require("./routes/venueRoutes")
const paymentRoutes = require("./routes/paymentRoutes")

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

connectDB()

// Mount Routes
app.use("/api/auth", authRoutes)
app.use("/api/games", gameRoutes)
app.use("/api/venues", venueRoutes)
app.use("/api/payment", paymentRoutes)

// Start server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
