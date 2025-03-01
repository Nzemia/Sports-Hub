import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native"
import React from "react"
import { useTheme } from "@/constants/ThemeProvider"
import { fontFamily } from "@/constants/fonts"

interface ButtonProps {
    title: string
    type?: "fill" | "outline"
    onPress?: () => void
    style?: any
    loading?: boolean
}

const CustomButton = ({
    title,
    type = "fill",
    onPress,
    style,
    loading
}: ButtonProps) => {
    const { theme } = useTheme()
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                {
                    backgroundColor:
                        type === "fill"
                            ? theme.primary
                            : theme.secondary
                },
                style
            ]}
            disabled={loading}
        >
            {!loading ? (
                <Text
                    style={[
                        styles.buttonText,
                        { color: theme.text }
                    ]}
                >
                    {title}
                </Text>
            ) : (
                <ActivityIndicator
                    size="small"
                    color={theme.text}
                />
            )}
        </TouchableOpacity>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    button: {
        padding: 15,
        width: "80%",
        borderRadius: 15,
        marginTop: 25
    },
    buttonText: {
        fontFamily: fontFamily.bold,
        fontSize: 15,
        textAlign: "center"
    }
})
