import { StyleSheet, Text, View } from "react-native"
import React from "react"

type VenueCardProps = {
    item: {
        id: string
    }
}

const VenueCard = ({ item }: VenueCardProps) => {
    return (
        <View>
            <Text style={{ color: "red" }}>VenueCard</Text>
        </View>
    )
}

export default VenueCard

const styles = StyleSheet.create({})
