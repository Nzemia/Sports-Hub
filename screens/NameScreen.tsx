import { Image, StyleSheet, Text, View } from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import { fontFamily } from "@/constants/fonts"
import CustomTextInput from "@/components/TextInput"
import { Ionicons } from "@expo/vector-icons"
import GoNextButton from "@/components/GoNextButton"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "expo-router"

type EmailNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Email"
>

const NameScreen = () => {
    const { theme } = useTheme()

    const navigation = useNavigation<EmailNavigationProp>()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const handleNext = () => {
        navigation.navigate("Email")
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <Text
                style={[
                    styles.header,
                    {
                        color: theme.text
                    }
                ]}
            >
                What would you like your mates to call you?
            </Text>

            <View
                style={{
                    marginTop: 30,
                    marginHorizontal: 20
                }}
            >
                {/** person and the 3 dots */}
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
                            borderColor: theme.text,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Ionicons
                            style={{ color: theme.text }}
                            name="person-add-sharp"
                            size={27}
                        />
                    </View>

                    <Image
                        style={{ width: 100, height: 40 }}
                        source={{
                            uri: "https://cdn-icons-png.flaticon.com/128/10613/10613685.png"
                        }}
                        tintColor={theme.text}
                    />
                </View>

                <View style={{ marginTop: 30 }}>
                    <Text
                        style={[
                            styles.nameText,
                            { color: theme.text }
                        ]}
                    >
                        Enter your details
                    </Text>

                    <View style={{ gap: 15 }}>
                        {/** first Name */}
                        <CustomTextInput
                            placeholder="Enter your first name*"
                            placeholderTextColor={"gray"}
                            value={firstName}
                            onChangeText={setFirstName}
                            autoFocus={true}
                        />
                        {/* {error && (
                        <Text
                            style={[
                                styles.errorText,
                                { color: "red" }
                            ]}
                        >
                            {error}
                        </Text>
                    )} */}
                        {/** Last Name */}
                        <CustomTextInput
                            placeholder="Enter your last name"
                            placeholderTextColor={"gray"}
                            value={lastName}
                            onChangeText={setLastName}
                            autoFocus={true}
                        />
                    </View>

                    <Text
                        style={[
                            styles.lastNameOptionalText,
                            { color: theme.text }
                        ]}
                    >
                        Last name is optional
                    </Text>
                </View>
                {/** Go Next */}
                <GoNextButton onPress={handleNext} />
            </View>
        </SafeAreaView>
    )
}

export default NameScreen

const styles = StyleSheet.create({
    header: {
        marginTop: 30,
        textAlign: "center",
        fontSize: 16,
        fontFamily: fontFamily.bold
    },
    nameText: {
        fontSize: 16,
        fontFamily: fontFamily.medium,
        marginTop: 10
    },
    input: {
        width: "100%",
        height: 40,
        borderRadius: 5,
        borderWidth: 2,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        fontFamily: fontFamily.medium
    },
    errorText: {
        marginTop: 10
    },
    lastNameOptionalText: {
        fontSize: 12,
        marginTop: 10,
        fontFamily: fontFamily.italic
    }
})
