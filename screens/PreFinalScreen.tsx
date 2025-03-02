import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import { fontFamily } from "@/constants/fonts"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "expo-router"

type MainStackNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "MainStack"
>

const PreFinalScreen = () => {
    const { theme } = useTheme()

    const navigation =
        useNavigation<MainStackNavigationProp>()

    const registerUser = () => {}
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
