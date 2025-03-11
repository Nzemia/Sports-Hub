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
router.get("/", async (req, res) => {
    try {
        const venues = await Venue.find()
        res.status(200).json(venues)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Book a court
router.post("/book", async (req, res) => {
    try {
        const {
            courtNumber,
            date,
            time,
            userId,
            name,
            game,
            paymentOrderId
        } = req.body

        // Create booking
        const newBooking = new Booking({
            courtNumber,
            date,
            time,
            userId,
            venueName: name,
            gameId: game,
            paymentOrderId
        })

        await newBooking.save()

        // If this is a game booking, update the game status
        if (game) {
            await game.findByIdAndUpdate(game, {
                isBooked: true,
                courtNumber
            })
        }

        res.status(200).json({
            message: "Booking successful"
        })
    } catch (error) {
        console.error("Booking error:", error)
        res.status(500).json({ message: "Booking failed" })
    }
})

module.exports = router
