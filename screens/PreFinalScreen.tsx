import {
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
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "expo-router"
import { AuthContext } from "@/context/AuthContext"
import axios from "axios"
import { getRegistrationProgress } from "@/utils/RegistrationProgress"
import AsyncStorage from "@react-native-async-storage/async-storage"

type MainStackNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "MainStack"
>

const PreFinalScreen = () => {
    const { theme } = useTheme()

    const navigation =
        useNavigation<MainStackNavigationProp>()

    const [userData, setUserData] = useState({})

    const { token, setToken } = useContext(AuthContext)

    useEffect(() => {
        if (token) {
            navigation.replace("MainStack")
        }
    }, [token, navigation])

    //console.log("token:", token)

    //get all user data on mount
    useEffect(() => {
        getAllUserData()
    }, [])

    //get user data
    const getAllUserData = async () => {
        try {
            const screens = [
                "Name",
                "Email",
                "Password",
                "Image"
            ]

            let userData = {}

            for (const screenName of screens) {
                const screenData =
                    await getRegistrationProgress(
                        screenName
                    )
                if (screenData) {
                    userData = {
                        ...userData,
                        ...screenData
                    }
                }
            }

            setUserData(userData)
        } catch (error) {
            console.error(
                "Error retrieving user data:",
                error
            )
            return null
        }
    }

    // clear data
    const clearAllScreenData = async () => {
        try {
            const screens = [
                "Name",
                "Email",
                "Password",
                "Image"
            ]
            for (const screenName of screens) {
                const key = `registration_progress_${screenName}`
                await AsyncStorage.removeItem(key)
            }
            // console.log(
            //     "All screen data cleared successfully"
            // )
        } catch (error) {
            console.error(
                "Error clearing screen data:",
                error
            )
        }
    }

    //register user
    const registerUser = async () => {
        try {
            const response = await axios
                .post(
                    "http://10.16.13.17:3000/api/auth/register",
                    userData
                )
                .then(async response => {
                    //console.log("response:", response)
                    const token = response.data.token
                    await AsyncStorage.setItem(
                        "token",
                        token
                    )
                    setToken(token)
                })

            clearAllScreenData()
        } catch (error) {
            console.error("Error registering user:", error)
            throw error
        }
    }

    //console.log("data", userData)
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <View style={{ marginTop: 80 }}>
                <Text
                    style={[
                        styles.headerText,
                        { color: theme.text }
                    ]}
                >
                    All set to register
                </Text>
                <Text
                    style={[
                        styles.subHeaderText,
                        {
                            color: theme.text
                        }
                    ]}
                >
                    Setting up your profile for you
                </Text>
            </View>
            <Pressable
                style={{
                    backgroundColor: "#900C",
                    padding: 15,
                    marginTop: "auto"
                }}
                onPress={registerUser}
            >
                <Text
                    style={[
                        styles.finishText,
                        { color: theme.text }
                    ]}
                >
                    Finish Registering
                </Text>
            </Pressable>
        </SafeAreaView>
    )
}

export default PreFinalScreen

const styles = StyleSheet.create({
    headerText: {
        fontSize: 22,
        fontFamily: fontFamily.bold,
        textAlign: "center",
        marginTop: 20
    },
    subHeaderText: {
        fontSize: 14,
        fontFamily: fontFamily.italic
    },
    finishText: {
        textAlign: "center",
        fontSize: 15,
        fontFamily: fontFamily.bold
    }
})
