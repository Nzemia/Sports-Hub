import {
    Alert,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, {
    useContext,
    useEffect,
    useState
} from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import { fontFamily } from "@/constants/fonts"
import CustomTextInput from "@/components/TextInput"
import useRegistration from "@/hooks/useRegistration"
import CustomButton from "@/components/Button"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "expo-router"
import { AuthContext } from "@/context/AuthContext"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { registerForPushNotificationsAsync } from "../utils/notificationHelper"

type NameNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Name"
>

type MainStackNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "MainStack"
>

const LoginScreen = () => {
    const { theme } = useTheme()

    const register = useNavigation<NameNavigationProp>()
    const navigation =
        useNavigation<MainStackNavigationProp>()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { error } = useRegistration("Email")

    const { token, setToken } = useContext(AuthContext)

    useEffect(() => {
        if (token) {
            navigation.replace("MainStack")
        }
    }, [token, navigation])

    const handleLogin = async () => {
        // Validate email and password
        if (!email || !password) {
            Alert.alert(
                "Error",
                "Email and password are required."
            )
            return
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            Alert.alert(
                "Error",
                "Enter a valid email address."
            )
            return
        }

        const user = {
            email: email.trim(),
            password: password.trim()
        }

        try {
            const response = await axios.post(
                "http://10.16.13.88:3000/api/auth/login",
                user
            )

            if (response.status === 200) {
                const token = response.data.token
                console.log("token", token)

                AsyncStorage.setItem("token", token)
                setToken(token)

                // Get push notification token
                const pushToken =
                    await registerForPushNotificationsAsync()

                // Update user with push token
                await axios.post(
                    "http://10.16.13.88:3000/api/users/update-token",
                    {
                        userId: response.data.userId,
                        expoPushToken: pushToken
                    }
                )
            }
        } catch (error) {
            console.error("Login failed:", error)
            Alert.alert(
                "Login Failed",
                "Invalid email or password."
            )
        }
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <View
                style={{
                    padding: 10,
                    //alignItems: "center"
                    marginHorizontal: 15
                }}
            >
                <KeyboardAvoidingView>
                    <View
                        style={{
                            marginTop: 80,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Text
                            style={[
                                styles.headerText,
                                { color: theme.text }
                            ]}
                        >
                            Login to your account
                        </Text>
                    </View>

                    <View style={{ marginTop: 50 }}>
                        <View>
                            <Text
                                style={[
                                    styles.enterEmailPassText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Email
                            </Text>
                            <View>
                                <CustomTextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder={
                                        "Enter Email"
                                    }
                                    placeholderTextColor={
                                        "gray"
                                    }
                                    keyboardType="email-address"
                                    autoFocus={true}
                                    autoCapitalize={"none"}
                                    autoCorrect={false}
                                />
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
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <Text
                                    style={[
                                        styles.enterEmailPassText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Password
                                </Text>

                                <CustomTextInput
                                    value={password}
                                    onChangeText={
                                        setPassword
                                    }
                                    placeholder={
                                        "Enter your password"
                                    }
                                    placeholderTextColor={
                                        "gray"
                                    }
                                    secureTextEntry={true}
                                    autoFocus={true}
                                    autoCapitalize={"none"}
                                    autoCorrect={false}
                                />

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
                            </View>
                        </View>

                        <CustomButton
                            title={"Login"}
                            onPress={handleLogin}
                            style={{
                                width: 250,
                                backgroundColor: "green",
                                padding: 15,
                                marginTop: 50,
                                marginLeft: "auto",
                                marginRight: "auto",
                                borderRadius: 8
                            }}
                        />

                        {/** register */}
                        <View
                            style={{
                                marginTop: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row"
                            }}
                        >
                            <Text
                                style={[
                                    styles.notHaveAccountText,
                                    { color: theme.text }
                                ]}
                            >
                                Don't have an account?{" "}
                            </Text>
                            <Pressable
                                onPress={() =>
                                    register.navigate(
                                        "Name"
                                    )
                                }
                            >
                                <Text
                                    style={[
                                        styles.registerText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Register
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    headerText: {
        fontSize: 24,
        fontFamily: fontFamily.extraBold,
        textAlign: "center",
        marginTop: 20
    },
    enterEmailPassText: {
        fontSize: 15,
        fontFamily: fontFamily.medium
    },
    errorText: {
        marginTop: 10
    },
    notHaveAccountText: {
        fontSize: 15,
        fontFamily: fontFamily.medium
    },
    registerText: {
        fontSize: 15,
        fontFamily: fontFamily.extraBold,
        textDecorationLine: "underline"
    }
})
