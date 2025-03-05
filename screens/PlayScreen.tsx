import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"

import { useTheme } from "@/constants/ThemeProvider"
import { fontFamily } from "@/constants/fonts"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "expo-router"

type VenueNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Create"
>

const PlayScreen = () => {
    const { theme } = useTheme()

    const navigation = useNavigation<VenueNavigationProp>()

    const [option, setOption] = useState("My Sports")

    const [sport, setSport] = useState("Chess")
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <View style={{ padding: 15 }}>
                {/** header */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5
                        }}
                    >
                        <Text
                            style={[
                                styles.headerText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            Play Screen
                        </Text>
                        <MaterialIcons
                            name={"keyboard-arrow-down"}
                            size={24}
                            color={theme.text}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10
                        }}
                    >
                        <Ionicons
                            name={"chatbox-outline"}
                            size={24}
                            color={theme.text}
                        />
                        <Ionicons
                            name={"notifications-outline"}
                            size={24}
                            color={theme.text}
                        />

                        <Pressable>
                            <Image
                                source={require("../assets/images/profileavatar.png")}
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15
                                }}
                            />
                        </Pressable>
                    </View>
                </View>

                {/** subheader */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        marginVertical: 15
                    }}
                >
                    <Pressable
                        onPress={() =>
                            setOption("Calendar")
                        }
                        style={[
                            styles.viewButton,
                            {
                                backgroundColor:
                                    theme.secondary
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styles.subheaderText,
                                {
                                    color:
                                        option == "Calendar"
                                            ? "yellow"
                                            : theme.text
                                }
                            ]}
                        >
                            Calendar
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() =>
                            setOption("My Sports")
                        }
                        style={[
                            styles.viewButton,
                            {
                                backgroundColor:
                                    theme.secondary
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styles.subheaderText,
                                {
                                    color:
                                        option ==
                                        "My Sports"
                                            ? "yellow"
                                            : theme.text
                                }
                            ]}
                        >
                            My Sports
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() =>
                            setOption("Other Sports")
                        }
                        style={[
                            styles.viewButton,
                            {
                                backgroundColor:
                                    theme.secondary
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styles.subheaderText,
                                {
                                    color:
                                        option ==
                                        "Other Sports"
                                            ? "yellow"
                                            : theme.text
                                }
                            ]}
                        >
                            Other Sports
                        </Text>
                    </Pressable>
                </View>

                {/** sports */}
                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={
                            false
                        }
                    >
                        <Pressable
                            style={{
                                padding: 10,
                                marginRight: 10,
                                borderColor: "white",
                                borderRadius: 10,
                                borderWidth:
                                    option == "Chess"
                                        ? 2
                                        : 0,
                                backgroundColor:
                                    sport == "Chess"
                                        ? "#1dbf22"
                                        : theme.inactiveTabColor
                            }}
                            onPress={() =>
                                setSport("Chess")
                            }
                        >
                            <Text
                                style={[
                                    styles.gamesText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Chess
                            </Text>
                        </Pressable>
                        <Pressable
                            style={{
                                padding: 10,
                                marginRight: 10,
                                borderColor: "white",
                                borderRadius: 10,
                                borderWidth:
                                    option == "Badminton"
                                        ? 2
                                        : 0,
                                backgroundColor:
                                    sport == "Badminton"
                                        ? "#1dbf22"
                                        : theme.inactiveTabColor
                            }}
                            onPress={() =>
                                setSport("Badminton")
                            }
                        >
                            <Text
                                style={[
                                    styles.gamesText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Badminton
                            </Text>
                        </Pressable>
                        <Pressable
                            style={{
                                padding: 10,
                                marginRight: 10,
                                borderColor: "white",
                                borderRadius: 10,
                                borderWidth:
                                    option == "Cricket"
                                        ? 2
                                        : 0,
                                backgroundColor:
                                    sport == "Cricket"
                                        ? "#1dbf22"
                                        : theme.inactiveTabColor
                            }}
                            onPress={() =>
                                setSport("Cricket")
                            }
                        >
                            <Text
                                style={[
                                    styles.gamesText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Cricket
                            </Text>
                        </Pressable>
                        <Pressable
                            style={{
                                padding: 10,
                                marginRight: 10,
                                borderColor: "white",
                                borderRadius: 10,
                                borderWidth:
                                    option == "Running"
                                        ? 2
                                        : 0,
                                backgroundColor:
                                    sport == "Running"
                                        ? "#1dbf22"
                                        : theme.inactiveTabColor
                            }}
                            onPress={() =>
                                setSport("Running")
                            }
                        >
                            <Text
                                style={[
                                    styles.gamesText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Running
                            </Text>
                        </Pressable>
                        <Pressable
                            style={{
                                padding: 10,
                                marginRight: 10,
                                borderColor: "white",
                                borderRadius: 10,
                                borderWidth:
                                    option == "Football"
                                        ? 2
                                        : 0,
                                backgroundColor:
                                    sport == "Football"
                                        ? "#1dbf22"
                                        : theme.inactiveTabColor
                            }}
                            onPress={() =>
                                setSport("Football")
                            }
                        >
                            <Text
                                style={[
                                    styles.gamesText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Football
                            </Text>
                        </Pressable>
                        <Pressable
                            style={{
                                padding: 10,
                                marginRight: 10,
                                borderColor: "white",
                                borderRadius: 10,
                                borderWidth:
                                    option == "Tennis"
                                        ? 2
                                        : 0,
                                backgroundColor:
                                    sport == "Tennis"
                                        ? "#1dbf22"
                                        : theme.inactiveTabColor
                            }}
                            onPress={() =>
                                setSport("Tennis")
                            }
                        >
                            <Text
                                style={[
                                    styles.gamesText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Tennis
                            </Text>
                        </Pressable>
                        <Pressable
                            style={{
                                padding: 10,
                                marginRight: 10,
                                borderColor: "white",
                                borderRadius: 10,
                                borderWidth:
                                    option == "Basketball"
                                        ? 2
                                        : 0,
                                backgroundColor:
                                    sport == "Basketball"
                                        ? "#1dbf22"
                                        : theme.inactiveTabColor
                            }}
                            onPress={() =>
                                setSport("Basketball")
                            }
                        >
                            <Text
                                style={[
                                    styles.gamesText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Basketball
                            </Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </View>

            {/** create game, filter, sort*/}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 12
                }}
            >
                <Pressable
                    onPress={() =>
                        navigation.navigate("Create")
                    }
                >
                    <Text
                        style={[
                            styles.createFilterSortText,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        Create Game
                    </Text>
                </Pressable>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10
                    }}
                >
                    <Pressable>
                        <Text
                            style={[
                                styles.createFilterSortText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            Filter
                        </Text>
                    </Pressable>
                    <Pressable>
                        <Text
                            style={[
                                styles.createFilterSortText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            Sort
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default PlayScreen

const styles = StyleSheet.create({
    headerText: {
        fontFamily: fontFamily.bold,
        fontSize: 18
    },
    subheaderText: {
        fontFamily: fontFamily.medium,
        fontSize: 15
    },
    viewButton: {
        padding: 7,
        borderRadius: 15,
        width: 90,
        shadowRadius: 3.9,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        alignItems: "center",
        justifyContent: "center"
    },
    gamesText: {
        fontFamily: fontFamily.regular
    },
    createFilterSortText: {
        fontFamily: fontFamily.bold,
        fontSize: 15,
        textDecorationLine: "underline"
    }
})
