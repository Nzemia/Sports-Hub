import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import { services } from "@/constants/data"
import { fontFamily } from "@/constants/fonts"

const Amenities = () => {
    const { theme } = useTheme()
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <View style={{ padding: 10 }}>
                <Text
                    style={[
                        styles.popularText,
                        {
                            color: theme.text
                        }
                    ]}
                >
                    Most Popular Facilities
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: "wrap"
                    }}
                >
                    {services.map((item, index) => (
                        <View
                            style={{
                                margin: 10,
                                backgroundColor: "#17B169",
                                paddingHorizontal: 11,
                                paddingVertical: 5,
                                borderRadius: 25
                            }}
                            key={index}
                        >
                            <Text
                                style={[
                                    styles.serviceText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                {item.name}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Amenities

const styles = StyleSheet.create({
    popularText: {
        fontSize: 15,
        fontFamily: fontFamily.bold,
        marginLeft: 15
    },
    serviceText: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        textAlign: "center"
    }
})
