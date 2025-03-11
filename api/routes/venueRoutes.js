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
    const { courtNumber, date, time, userId, name, game } =
        req.body

    //console.log("game", game)

    try {
        const venue = await Venue.findOne({ name: name })
        if (!venue) {
            return res
                .status(404)
                .json({ message: "Venue not found" })
        }

        // Check for booking conflicts
        const bookingConflict =
            venue.bookings &&
            venue.bookings.find(
                booking =>
                    booking.courtNumber === courtNumber &&
                    booking.date === date &&
                    booking.time === time
            )

        if (bookingConflict) {
            return res
                .status(400)
                .json({ message: "Slot already booked" })
        }

        // Add new booking
        venue.bookings.push({
            courtNumber,
            date,
            time,
            user: userId,
            game
        })

        await venue.save()

        // Update game with booking details
        await game.findByIdAndUpdate(game, {
            isBooked: true,
            courtNumber: courtNumber
        })

        res.status(200).json({
            message: "Booking successful",
            venue
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
})

module.exports = router
