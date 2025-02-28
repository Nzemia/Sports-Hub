import React from "react"
import {
    TextInput,
    TextInputProps,
    StyleSheet,
    TextStyle,
    View,
    Text
} from "react-native"
import { fontFamily } from "@/constants/fonts"
import { useTheme } from "@/constants/ThemeProvider"

interface CustomTextInputProps extends TextInputProps {
    placeholder: string
    value: string
    onChangeText: (text: string) => void
    style?: TextStyle
    numeric?: boolean
    error?: string
    label?: string
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
    placeholder,
    value,
    onChangeText,
    style,
    numeric = false,
    error,
    label,
    ...rest
}) => {
    const { theme } = useTheme()

    // Function to handle input changes
    const handleInputChange = (text: string) => {
        if (numeric) {
            const numericRegex = /^[0-9]*$/
            if (numericRegex.test(text)) {
                onChangeText(text)
            }
        } else {
            onChangeText(text)
        }
    }

    return (
        <View>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={theme.text}
                style={[
                    styles.textInputText,
                    {
                        color: theme.text,
                        borderColor: error
                            ? "red"
                            : theme.text
                    },
                    style
                ]}
                value={value}
                onChangeText={handleInputChange}
                keyboardType={
                    numeric ? "numeric" : "default"
                }
                {...rest}
            />
            {error && (
                <Text
                    style={{
                        color: "red",
                        fontSize: 12,
                        marginTop: 5
                    }}
                >
                    {error}
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    textInputText: {
        width: "100%",
        height: 40,
        borderRadius: 5,
        borderWidth: 2,
        padding: 10,
        //marginTop: 10,
        fontFamily: fontFamily.medium
    }
})

export default CustomTextInput
