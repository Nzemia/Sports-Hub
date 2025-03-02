import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import {
    AntDesign,
    MaterialCommunityIcons
} from "@expo/vector-icons"
import { fontFamily } from "@/constants/fonts"
import CustomTextInput from "@/components/TextInput"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "expo-router"
import useRegistration from "@/hooks/useRegistration"

type ImageNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Image"
>

const PasswordScreen = () => {
    const { theme } = useTheme()

    const navigation = useNavigation<ImageNavigationProp>()

    const [password, setPassword] = useState("")

    const { validateAndSave, error } =
        useRegistration("Password")

    const handleNext = async () => {
        const isValid = await validateAndSave({ password })
        if (isValid) {
            navigation.navigate("Image")
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
                    marginTop: 25,
                    marginHorizontal: 20
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <View
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            borderWidth: 2,
                            borderColor: "green",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <AntDesign
                            name="lock1"
                            size={26}
                            color="green"
                        />
                    </View>

                    <Image
                        style={{ width: 100, height: 40 }}
                        source={{
                            uri: "https://cdn-icons-png.flaticon.com/128/10613/10613685.png"
                        }}
                    />
                </View>
                <Text
                    style={[
                        styles.headerText,
                        { color: theme.text }
                    ]}
                >
                    Please choose a password
                </Text>

                <CustomTextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder={"Enter your password"}
                    placeholderTextColor={"gray"}
                    secureTextEntry={true}
                    autoFocus={true}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    style={{
                        marginTop: 25
                    }}
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

                <TouchableOpacity
                    onPress={handleNext}
                    activeOpacity={0.8}
                    style={{
                        marginTop: 30,
                        marginLeft: "auto"
                    }}
                >
                    <MaterialCommunityIcons
                        style={{
                            alignSelf: "center",
                            marginTop: 20
                        }}
                        name="arrow-right-circle"
                        size={45}
                        color="green"
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default PasswordScreen

const styles = StyleSheet.create({
    headerText: {
        fontSize: 22,
        fontFamily: fontFamily.bold,
        textAlign: "center",
        marginTop: 20
    },
    errorText: {
        marginTop: 10
    }
})
