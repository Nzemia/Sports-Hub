import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import { fontFamily } from "@/constants/fonts"
import CustomTextInput from "@/components/TextInput"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "@/configs/global"
import { useNavigation } from "expo-router"

type PasswordNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Password"
>

const RegisterScreen = () => {
    const { theme } = useTheme()

    const navigation =
        useNavigation<PasswordNavigationProp>()

    const [email, setEmail] = useState("")

    const sendOTP = () => {
        navigation.navigate("Password")
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
                        style={{
                            padding: 15,
                            marginTop: 20,
                            backgroundColor:
                                email?.length > 5
                                    ? "#2dcf30"
                                    : "gray",
                            borderRadius: 8
                        }}
                    >
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

export default RegisterScreen

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
    }
})
