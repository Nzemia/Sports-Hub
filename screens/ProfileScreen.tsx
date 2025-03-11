import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useContext, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import {
    AntDesign,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons
} from "@expo/vector-icons"
import { fontFamily } from "@/constants/fonts"
import { AuthContext } from "@/context/AuthContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "expo-router"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import Divider from "@/components/Divider"

type StartScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Register"
>

const ProfileScreen = () => {
    const { theme, toggleTheme, isDarkMode } = useTheme()

    const navigation =
        useNavigation<StartScreenNavigationProp>()

    const { setToken, setUserId } = useContext(AuthContext)

    const clearAuthToken = async () => {
        try {
            await AsyncStorage.removeItem("token")

            setToken("")

            setUserId("")

            navigation.replace("Register")
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <ScrollView>
                <View style={{ padding: 12 }}>
                    <View
                        style={[
                            styles.topContainer,
                            {
                                backgroundColor:
                                    theme.background
                            }
                        ]}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10
                            }}
                        >
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor:
                                        "#E0E0E0",
                                    justifyContent:
                                        "center",
                                    alignItems: "center"
                                }}
                            >
                                <AntDesign
                                    name="calendar"
                                    size={24}
                                    color={"green"}
                                />
                            </View>

                            <View style={{}}>
                                <Text
                                    style={[
                                        styles.containerHeadText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    My Bookings
                                </Text>
                                <Text
                                    style={[
                                        styles.containerDescriptionText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    View Transactions &
                                    Receipts
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                height: 1,
                                borderColor: "#E0E0E0",
                                borderWidth: 0.5,
                                marginTop: 15
                            }}
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                                marginVertical: 15
                            }}
                        >
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor:
                                        "#E0E0E0",
                                    justifyContent:
                                        "center",
                                    alignItems: "center"
                                }}
                            >
                                <Ionicons
                                    name="people-outline"
                                    size={24}
                                    color={"green"}
                                />
                            </View>

                            <View style={{}}>
                                <Text
                                    style={[
                                        styles.containerHeadText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    PlayPals
                                </Text>
                                <Text
                                    style={[
                                        styles.containerDescriptionText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    View & Manage Players
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                height: 1,
                                borderColor: "#E0E0E0",
                                borderWidth: 0.5
                            }}
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                                marginTop: 15
                            }}
                        >
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor:
                                        "#E0E0E0",
                                    justifyContent:
                                        "center",
                                    alignItems: "center"
                                }}
                            >
                                <AntDesign
                                    name="book"
                                    size={24}
                                    color={"green"}
                                />
                            </View>

                            <View style={{}}>
                                <Text
                                    style={[
                                        styles.containerHeadText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Passbook
                                </Text>
                                <Text
                                    style={[
                                        styles.containerDescriptionText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Manage Karma points
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                height: 1,
                                borderColor: "#E0E0E0",
                                borderWidth: 0.5,
                                marginTop: 15
                            }}
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                                marginTop: 15,
                                marginBottom: 10
                            }}
                        >
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor:
                                        "#E0E0E0",
                                    justifyContent:
                                        "center",
                                    alignItems: "center"
                                }}
                            >
                                <MaterialIcons
                                    name="energy-savings-leaf"
                                    size={24}
                                    color={"green"}
                                />
                            </View>

                            <View style={{}}>
                                <Text
                                    style={[
                                        styles.containerHeadText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Preference and Privacy
                                </Text>
                                <Text
                                    style={[
                                        styles.containerDescriptionText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    View Transactions &
                                    Receipts
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Divider thickness={2} />

                <View style={[styles.bottomContainer]}>
                    <View
                        style={{
                            padding: 10,
                            borderRadius: 10
                        }}
                    >
                        <Pressable
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10
                            }}
                        >
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor:
                                        "#E0E0E0",
                                    justifyContent:
                                        "center",
                                    alignItems: "center"
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="theme-light-dark"
                                    size={24}
                                    color={"green"}
                                />
                            </View>

                            <Pressable
                                onPress={toggleTheme}
                                style={({ pressed }) => [
                                    {
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        flexDirection:
                                            "row",
                                        opacity: pressed
                                            ? 0.7
                                            : 1
                                    }
                                ]}
                            >
                                <Text
                                    style={{
                                        color: theme.text,
                                        fontSize: 16,
                                        fontFamily:
                                            fontFamily.bold
                                    }}
                                >
                                    {isDarkMode
                                        ? "Switch to Light Mode 🌞"
                                        : "Switch to Dark Mode 🌙"}
                                </Text>
                            </Pressable>
                        </Pressable>

                        <View
                            style={{
                                height: 1,
                                borderColor: "#E0E0E0",
                                borderWidth: 0.5,
                                marginTop: 15
                            }}
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                                marginVertical: 15
                            }}
                        >
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor:
                                        "#E0E0E0",
                                    justifyContent:
                                        "center",
                                    alignItems: "center"
                                }}
                            >
                                <Ionicons
                                    name="people-outline"
                                    size={24}
                                    color={"green"}
                                />
                            </View>

                            <View style={{}}>
                                <Text
                                    style={[
                                        styles.containerHeadText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Blogs
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                height: 1,
                                borderColor: "#E0E0E0",
                                borderWidth: 0.5
                            }}
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                                marginTop: 10
                            }}
                        >
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor:
                                        "#E0E0E0",
                                    justifyContent:
                                        "center",
                                    alignItems: "center"
                                }}
                            >
                                <AntDesign
                                    name="book"
                                    size={24}
                                    color={"green"}
                                />
                            </View>

                            <View style={{}}>
                                <Text
                                    style={[
                                        styles.containerHeadText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Invite & Earn
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                height: 1,
                                borderColor: "#E0E0E0",
                                borderWidth: 0.5,
                                marginTop: 15
                            }}
                        />

                       

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                                marginTop: 15,
                                marginBottom: 10
                            }}
                        >
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor:
                                        "#E0E0E0",
                                    justifyContent:
                                        "center",
                                    alignItems: "center"
                                }}
                            >
                                <MaterialIcons
                                    name="energy-savings-leaf"
                                    size={24}
                                    color={"green"}
                                />
                            </View>

                            <Pressable
                                onPress={clearAuthToken}
                            >
                                <Text
                                    style={[
                                        styles.containerHeadText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Logout
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    topContainer: {
        padding: 10,
        borderRadius: 10
    },
    containerHeadText: {
        fontSize: 16,
        fontFamily: fontFamily.bold
    },
    containerDescriptionText: {
        marginTop: 7,
        fontFamily: fontFamily.medium
    },
    bottomContainer: {
        padding: 8,
        borderRadius: 10,
        marginTop: 10
    }
})
