const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const moment = require("moment")

const connectDB = require("./config/db")

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const jwt = require("jsonwebtoken")

connectDB()

// Start server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
