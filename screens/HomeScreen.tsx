// @ts-nocheck

import {
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, {
    useContext,
    useEffect,
    useLayoutEffect,
    useState
} from "react"
import { useTheme } from "@/constants/ThemeProvider"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { fontFamily } from "@/constants/fonts"
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry"
import AntDesign from "@expo/vector-icons/AntDesign"
import { data } from "@/constants/data"
import { AuthContext } from "@/context/AuthContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type ProfileNavigation = NativeStackNavigationProp<
    RootStackParamList,
    "Profile"
>

type CalendarPlayNavigation = NativeStackNavigationProp<
    RootStackParamList,
    "Play"
>

const HomeScreen = () => {
    const { theme } = useTheme()

    const navigation =
        useNavigation<CalendarPlayNavigation>()

    const profileNavigation =
        useNavigation<ProfileNavigation>()

    const { userId, setUserId } = useContext(AuthContext)
    //console.log("token:", token)

    const [user, setUser] = useState<any>("")

    const [upcomingGames, setUpcomingGames] = useState([])

    {
        /**header */
    }
    useLayoutEffect(() => {
        return navigation.setOptions({
            headerStyle: {
                backgroundColor: theme.background,
                borderBottomWidth: 3
            },
            headerTintColor: theme.text,
            headerTitle: "",
            headerLeft: () => (
                <View
                    style={[
                        styles.headerLeft,
                        {
                            backgroundColor:
                                theme.background
                        }
                    ]}
                >
                    <Text
                        style={[
                            styles.headerTitle,
                            { color: theme.text }
                        ]}
                    >
                        SportsHub
                    </Text>
                </View>
            ),
            headerRight: () => (
                <View style={[styles.headerRight]}>
                    <Ionicons
                        name="chatbox-outline"
                        size={24}
                        color={theme.text}
                    />
                    <Ionicons
                        name="notifications-outline"
                        size={24}
                        color={theme.text}
                    />

                    <Pressable
                        onPress={() =>
                            profileNavigation.navigate(
                                "Profile"
                            )
                        }
                    >
                        {user?.image ? (
                            <Image
                                source={{
                                    uri: user?.image
                                }}
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15
                                }}
                            />
                        ) : (
                            <Image
                                source={require("../assets/images/profileavatar.png")}
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15
                                }}
                            />
                        )}
                    </Pressable>
                </View>
            )
        })
    }, [user, theme])

    useEffect(() => {
        fetchUser(setUser, setUserId)
    }, [])

    const fetchUser = async (
        setUser: Function,
        setUserId: Function
    ) => {
        try {
            const token = await AsyncStorage.getItem(
                "token"
            )

            if (!token) {
                console.error("No token found")
                return
            }

            // Decode token and extract userId
            const decodedToken: { userId?: string } =
                jwtDecode(token)

            if (!decodedToken.userId) {
                throw new Error(
                    "User ID not found in token"
                )
            }

            const userId = decodedToken.userId
            setUserId(userId)

            const response = await axios.get(
                `http://10.16.13.213:3000/api/auth/user/${userId}`
            )

            if (!response.data) {
                console.error(
                    "User data is empty:",
                    response.data
                )
                return
            }

            setUser(response.data)
        } catch (error) {
            console.error(
                "Error fetching user data:",
                error
            )
        }
    }
    //console.log("user", userId)

    // useEffect(() => {
    //     if (userId) {
    //         fetchUpcomingGames()
    //     }
    // }, [userId])
    // const fetchUpcomingGames = async () => {
    //     try {
    //         const response = await axios.get(
    //             `http://10.16.13.213:3000/api/games/upcoming?userId=${userId}`
    //         )
    //         setUpcomingGames(response.data)
    //     } catch (error) {
    //         console.error(
    //             "Failed to fetch upcoming games:",
    //             error
    //         )
    //     }
    // }

    // console.log("user", upcomingGames?.length)

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
            edges={["left", "right"]}
        >
            <ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 15,
                        marginTop: 15,
                        alignSelf: "center",
                        justifyContent: "center"
                    }}
                >
                    <View>
                        <Image
                            source={{
                                uri: "https://cdn-icons-png.flaticon.com/128/785/785116.png"
                            }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 25
                            }}
                        />
                    </View>

                    <View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 4
                            }}
                        >
                            <Text
                                style={[
                                    styles.setGoalText,
                                    { color: theme.text }
                                ]}
                            >
                                Set your weekly fit goal
                            </Text>

                            <Image
                                source={{
                                    uri: "https://cdn-icons-png.flaticon.com/128/426/426833.png"
                                }}
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10
                                }}
                            />
                        </View>

                        <Text
                            style={[
                                styles.keepFitText,
                                { color: theme.text }
                            ]}
                        >
                            Keep yourself fit and healthy
                        </Text>
                    </View>
                </View>

                {/** activity and view button */}
                <View
                    style={{
                        padding: 13,
                        marginVertical: 6,
                        marginHorizontal: 13
                    }}
                >
                    <View
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            width: 200,
                            marginVertical: 5,
                            borderRadius: 4,
                            padding: 10
                        }}
                    >
                        {/* <Text
                            style={[
                                styles.getUpText,
                                {
                                    color: theme.text,
                                    backgroundColor:
                                        theme.secondary
                                }
                            ]}
                        >
                            Get up for your game
                        </Text>  */}
                    </View>

                    {/** activity and view button */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <Text
                            style={[
                                styles.badmintonActivityText,
                                { color: theme.text }
                            ]}
                        >
                            Activities
                        </Text>
                        <Pressable
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
                                    styles.viewText,
                                    { color: theme.text }
                                ]}
                            >
                                View
                            </Text>
                        </Pressable>
                    </View>

                    {/** having games text */}
                    <Text
                        style={[
                            styles.haveGamesText,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        You have no games today
                    </Text>

                    {/** view calendar button */}
                    <Pressable
                        onPress={() =>
                            navigation.navigate("Play", {
                                initialOption: "Calendar"
                            })
                        }
                        style={{
                            marginTop: 10,
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}
                    >
                        <Text
                            style={[
                                styles.viewCalendarText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            View my Calendar
                        </Text>
                    </Pressable>
                </View>

                {/** images */}
                <View
                    style={{
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <Pressable>
                        <View>
                            <Image
                                source={require("../assets/images/kenyaplayersplaying.jpeg")}
                                style={{
                                    width: 160,
                                    height: 120,
                                    borderRadius: 10
                                }}
                            />
                        </View>

                        <Pressable
                            style={{
                                padding: 12,
                                width: 180
                            }}
                        >
                            <View
                                style={{
                                    alignItems: "center"
                                }}
                            >
                                <Text
                                    style={[
                                        styles.playText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Play
                                </Text>
                                {/* <Text
                                    style={[
                                        styles.findPlayersText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Find players and join
                                    their activities
                                </Text> */}
                            </View>
                        </Pressable>
                    </Pressable>

                    <Pressable>
                        <View>
                            <Image
                                source={{
                                    uri: "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800"
                                }}
                                style={{
                                    width: 160,
                                    height: 120,
                                    borderRadius: 10
                                }}
                            />
                        </View>

                        <Pressable
                            style={{
                                padding: 12,
                                width: 180
                            }}
                        >
                            <View
                                style={{
                                    alignItems: "center"
                                }}
                            >
                                <Text
                                    style={[
                                        styles.playText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Book
                                </Text>
                                {/* <Text
                                    style={[
                                        styles.findPlayersText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Find players and join
                                    their activities
                                </Text> */}
                            </View>
                        </Pressable>
                    </Pressable>
                </View>

                {/** Groups and game activities */}
                <View style={{ padding: 13 }}>
                    <View
                        style={{
                            padding: 10,
                            flexDirection: "row",
                            gap: 10
                        }}
                    >
                        <View
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "green"
                            }}
                        >
                            <AntDesign
                                name={"addusergroup"}
                                color={theme.text}
                                size={20}
                            />
                        </View>
                        <View>
                            <Text
                                style={[
                                    styles.groupText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Groups
                            </Text>
                            <Text
                                style={[
                                    styles.connectText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Connect, Compete and Discuss
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            padding: 10,
                            flexDirection: "row",
                            gap: 10,
                            marginTop: 10
                        }}
                    >
                        <View
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "yellow"
                            }}
                        >
                            <Ionicons
                                name={"tennisball-outline"}
                                color={"black"}
                                size={20}
                            />
                        </View>
                        <View>
                            <Text
                                style={[
                                    styles.groupText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Game Time Activities
                            </Text>
                            <Text
                                style={[
                                    styles.connectText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                47 already hosted games
                            </Text>
                        </View>
                    </View>
                </View>

                {/**Spotlight */}
                <View style={{ padding: 13 }}>
                    <View
                        style={{
                            padding: 10,
                            backgroundColor:
                                theme.background
                        }}
                    >
                        <Text
                            style={[
                                styles.spotlightText,
                                { color: theme.text }
                            ]}
                        >
                            Spotlight
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={
                                false
                            }
                        >
                            {data.map((item, index) => (
                                <ImageBackground
                                    source={{
                                        uri: item?.image
                                    }}
                                    key={index}
                                    imageStyle={{
                                        borderRadius: 15
                                    }}
                                    style={{
                                        width: 220,
                                        height: 200,
                                        marginRight: 10,
                                        marginVertical: 15
                                    }}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>

                {/**Footer */}
                <View>
                    <View
                        style={{
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}
                    >
                        <Image
                            style={{
                                width: 120,
                                height: 70,
                                resizeMode: "contain"
                            }}
                            source={{
                                uri: "https://playo-website.gumlet.io/playo-website-v2/logos-icons/new-logo-playo.png?q=50"
                            }}
                        />
                    </View>
                    <Text
                        style={[
                            styles.footerText,
                            { color: theme.text }
                        ]}
                    >
                        Developed by Nzemia with ❤️
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 15
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginRight: 15
    },
    headerTitle: {
        marginLeft: 15,
        fontFamily: fontFamily.extraBold,
        fontSize: 25
    },
    setGoalText: {
        fontFamily: fontFamily.medium,
        fontSize: 16
    },
    keepFitText: {
        marginTop: 9,
        fontFamily: fontFamily.regular,
        fontSize: 12
    },
    getUpText: {
        fontFamily: fontFamily.regular,
        fontSize: 13,
        paddingVertical: 8,
        paddingHorizontal: 10
    },
    badmintonActivityText: {
        fontFamily: fontFamily.regular
    },
    viewText: {
        fontFamily: fontFamily.bold,
        fontSize: 15
    },
    viewButton: {
        padding: 10,
        borderRadius: 10,
        width: 80,
        shadowRadius: 3.84,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        alignItems: "center",
        justifyContent: "center"
    },
    haveGamesText: {
        fontFamily: fontFamily.light,
        marginTop: 4
    },
    viewCalendarText: {
        fontFamily: fontFamily.bold,
        fontSize: 15,
        textDecorationLine: "underline"
    },
    playText: {
        fontFamily: fontFamily.bold,
        fontSize: 15
    },
    findPlayersText: {
        fontFamily: fontFamily.italic,
        fontSize: 10
    },
    groupText: {
        fontFamily: fontFamily.bold,
        fontSize: 15
    },
    connectText: {
        fontFamily: fontFamily.italic,
        fontSize: 10,
        marginTop: 5
    },
    spotlightText: {
        fontFamily: fontFamily.medium,
        fontSize: 18
    },
    footerText: {
        fontFamily: fontFamily.extraBold,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 10
    }
})
