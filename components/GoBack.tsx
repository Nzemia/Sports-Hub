import {
    Pressable,
    StyleSheet,   
} from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import { useNavigation } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

const GoBack = () => {
    const { theme } = useTheme()
    const navigation = useNavigation()
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <Pressable onPress={() => navigation.goBack()}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color={theme.text}
                />
            </Pressable>
        </SafeAreaView>
    )
}

export default GoBack

const styles = StyleSheet.create({})
