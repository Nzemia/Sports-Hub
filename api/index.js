const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


connectDB()

// Mount Routes
app.use("/api/auth", authRoutes); 

// Start server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
