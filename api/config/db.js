const mongoose = require("mongoose")
const Venue = require("../models/venueModel")
const venues = require("../constants/data")
require("dotenv").config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB")

        await seedVenues()
    } catch (error) {
        console.error(
            "❌ Error connecting to MongoDB:",
            error
        )
        process.exit(1)
    }
}

// insert venues if they don’t exist
//----> uncomment the consoles to make sure they are added to db
const seedVenues = async () => {
    try {
        for (const venueData of venues) {
            const existingVenue = await Venue.findOne({
                name: venueData.name
            })
            if (!existingVenue) {
                await Venue.create(venueData)
                // console.log(
                //     `Venue '${venueData.name}' added`
                // )
            } else {
                // console.log(
                //     `Venue '${venueData.name}' already exists. Skipping.`
                // )
            }
        }
    } catch (error) {
        console.error("❌ Error seeding venues:", error)
    }
}

module.exports = connectDB
