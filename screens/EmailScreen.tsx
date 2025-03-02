import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import { fontFamily } from "@/constants/fonts"
import CustomTextInput from "@/components/TextInput"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "@/configs/global"
import { useNavigation } from "expo-router"
import useRegistration from "@/hooks/useRegistration"
import { getRegistrationProgress } from "@/utils/RegistrationProgress"

type PasswordNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Password"
>

const EmailScreen = () => {
    const { theme } = useTheme()

    const navigation =
        useNavigation<PasswordNavigationProp>()

    const [email, setEmail] = useState("")
    const [isEmailValid, setIsEmailValid] =
        useState<boolean>(false)

    const { validateAndSave, error } =
        useRegistration("Email")

    useEffect(() => {
        getRegistrationProgress("Email").then(
            progressData => {
                if (progressData) {
                    setEmail(progressData.email || "")
                }
            }
        )
    }, [])

    useEffect(() => {
        setIsEmailValid(isValidEmail(email))
    }, [email])

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const sendOTP = async () => {
        const isValidEmail = await validateAndSave({
            email
        })
        if (isValidEmail) {
            navigation.navigate("Password")
        }
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <View style={{ padding: 20 }}>
                <Text
                    style={[
                        styles.headerText,
                        { color: theme.text }
                    ]}
                >
                    You're Almost There
                </Text>

                <View
                    style={{
                        flexDirection: "column",
                        gap: 16,
                        marginVertical: 40
                    }}
                >
                    <Text
                        style={[
                            styles.enterEmailText,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        Enter Email
                    </Text>

                    <CustomTextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder={"Enter Email"}
                        placeholderTextColor={"gray"}
                        keyboardType="email-address"
                        autoFocus={true}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                    />

                    <Pressable
                        onPress={sendOTP}
                        disabled={!isEmailValid}
                        style={[
                            styles.button,
                            {
                                backgroundColor:
                                    isEmailValid
                                        ? "#2DCF30"
                                        : "#A5D6A7"
                            }
                        ]}
                    >
                        {error && (
                            <Text
                                style={[
                                    styles.errorText,
                                    { color: "red" }
                                ]}
                            >
                                {error}
                            </Text>
                        )}
                        <Text
                            style={{ textAlign: "center" }}
                        >
                            Next
                        </Text>
                    </Pressable>
                </View>

                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Text
                        style={[
                            styles.termsText,
                            { color: theme.text }
                        ]}
                    >
                        By Signing up, you agree to the
                        Terms of Service and Privacy and
                        Privacy Policy
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default EmailScreen

const styles = StyleSheet.create({
    headerText: {
        fontSize: 22,
        fontFamily: fontFamily.bold,
        textAlign: "center",
        marginTop: 20
    },
    enterEmailText: {
        fontSize: 15,
        fontFamily: fontFamily.medium
    },
    termsText: {
        fontSize: 15,
        textAlign: "center",
        fontFamily: fontFamily.italic
    },
    button: {
        padding: 15,
        marginTop: 20,
        borderRadius: 8,
        alignItems: "center"
    },
    errorText: {
        marginTop: 10
    }
})
