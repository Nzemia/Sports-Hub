const express = require("express")
const Venue = require("../models/venueModel")

const router = express.Router()

// Add venues to the database
router.post("/add-venues", async (req, res) => {
    try {
        const venues = req.body
        for (const venueData of venues) {
            const existingVenue = await Venue.findOne({
                name: venueData.name
            })
            if (!existingVenue) {
                const newVenue = new Venue(venueData)
                await newVenue.save()
                // console.log(
                //     `Venue ${venueData.name} saved successfully`
                // )
            }
        }
        res.status(201).json({
            message: "Venues added successfully!"
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Fetch all venues
router.get("/venues", async (req, res) => {
    try {
        const venues = await Venue.find()
        res.status(200).json(venues)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
