const mongoose = require("mongoose")
const Venue = require("../models/venueModel")
const venues = require("../constants/data")
require("dotenv").config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB")

        await seedVenues()
        //await removeVenues()
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
const removeVenues = async () => {
    try {
        const result = await Venue.deleteMany({})
        console.log(`Removed ${result.deletedCount} venues`)
    } catch (error) {
        console.error("❌ Error removing venues:", error)
    }
}

//Remove Only Seeded Venues
const removeSeededVenues = async () => {
    try {
        const venueNames = venues.map(v => v.name) // Extract names from the seed data
        const result = await Venue.deleteMany({
            name: { $in: venueNames }
        })
        console.log(
            `✅ Removed ${result.deletedCount} seeded venues`
        )
    } catch (error) {
        console.error(
            "❌ Error removing seeded venues:",
            error
        )
    }
}
module.exports = connectDB
