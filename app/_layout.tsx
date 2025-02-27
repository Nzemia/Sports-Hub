import { useState, useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import * as Font from "expo-font"
import { Slot } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { fontFamily } from "@/constants/fonts"
import {
    ThemeProvider,
    useTheme
} from "@/constants/ThemeProvider"

const loadFonts = async () => {
    await Font.loadAsync({
        [fontFamily.regular]: require("../assets/fonts/Kanit-Regular.ttf"),
        [fontFamily.bold]: require("../assets/fonts/Kanit-Bold.ttf"),
        [fontFamily.semiBold]: require("../assets/fonts/Kanit-SemiBold.ttf"),
        [fontFamily.extraBold]: require("../assets/fonts/Kanit-ExtraBold.ttf"),
        [fontFamily.light]: require("../assets/fonts/Kanit-Light.ttf"),
        [fontFamily.medium]: require("../assets/fonts/Kanit-Medium.ttf"),
        [fontFamily.italic]: require("../assets/fonts/Kanit-Italic.ttf")
    })
}

export default function Layout() {
    const [fontsLoaded, setFontsLoaded] = useState(false)

    useEffect(() => {
        loadFonts().then(() => setFontsLoaded(true))
    }, [])

    if (!fontsLoaded) {
        return (
            <ActivityIndicator size="large" color="black" />
        )
    }

    return (
        <ThemeProvider>
            <ThemedLayout />
        </ThemeProvider>
    )
}

function ThemedLayout() {
    const { theme } = useTheme()
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <StatusBar style={theme.statusBarStyle} />
            <Slot />
        </View>
    )
}
