import { useState, useEffect } from "react"
import * as Location from "expo-location"

export const useLocation = () => {
    const [errorMsg, setErrorMsg] = useState<string | null>(
        null
    )
    const [location, setLocation] =
        useState<Location.LocationObject | null>(null)
    const [markerPosition, setMarkerPosition] = useState({
        latitude: 0,
        longitude: 0
    })
    const [address, setAddress] = useState<string | null>(
        null
    )

    useEffect(() => {
        ;(async () => {
            let { status } =
                await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                setErrorMsg(
                    "Permission to access location was denied"
                )
                return
            }

            // Get the user's current location
            let currentLocation =
                await Location.getCurrentPositionAsync({})
            setLocation(currentLocation)
            setMarkerPosition({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude
            })

            // Reverse geocode the initial location
            await reverseGeocode(
                currentLocation.coords.latitude,
                currentLocation.coords.longitude
            )
        })()
    }, [])

    // Reverse geocode coordinates to get the address
    const reverseGeocode = async (
        latitude: number,
        longitude: number
    ) => {
        try {
            const addressResponse =
                await Location.reverseGeocodeAsync({
                    latitude,
                    longitude
                })
            if (addressResponse.length > 0) {
                const { city, region, country } =
                    addressResponse[0]
                const formattedAddress = `${city}, ${region}, ${country}`
                setAddress(formattedAddress)
            }
        } catch (error) {
            console.error(
                "Reverse geocoding failed:",
                error
            )
            setAddress("Address not available")
        }
    }

    // Handle Marker Drag End
    const handleMarkerDragEnd = async (e: {
        nativeEvent: {
            coordinate: {
                latitude: number
                longitude: number
            }
        }
    }) => {
        const { latitude, longitude } =
            e.nativeEvent.coordinate
        setMarkerPosition({ latitude, longitude })

        await reverseGeocode(latitude, longitude)
    }

    return {
        errorMsg,
        location,
        markerPosition,
        address,
        handleMarkerDragEnd
    }
}
