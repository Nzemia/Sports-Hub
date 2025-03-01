import React from "react"
import { View, StyleSheet } from "react-native"

interface DividerProps {
    color?: string
    thickness?: number
    marginVertical?: number
}

const Divider = ({
    color = "#e0e0e0",
    thickness = 1,
    marginVertical = 10
}: DividerProps) => {
    return (
        <View
            style={[
                styles.divider,
                {
                    backgroundColor: color,
                    height: thickness,
                    marginVertical: marginVertical
                }
            ]}
        />
    )
}

export default Divider

const styles = StyleSheet.create({
    divider: {
        width: "100%"
    }
})
