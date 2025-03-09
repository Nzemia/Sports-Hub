// @ts-nocheck
import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, {
    useCallback,
    useContext,
    useEffect,
    useState
} from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"

import { useTheme } from "@/constants/ThemeProvider"
import { fontFamily } from "@/constants/fonts"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useFocusEffect, useNavigation } from "expo-router"
import { AuthContext } from "@/context/AuthContext"
import axios from "axios"
import Game from "@/components/Game"
import UpComingGame from "@/components/UpComingGame"
import {
    RouteProp,
    useRoute
} from "@react-navigation/native"

// Define interfaces at the top level
interface Game {
    _id: string
    sport: string
    date: string
    time: string
    area: string
    players: Player[]
    totalPlayers: number
    adminName: string
    adminUrl: string
    matchFull: boolean
}

interface Player {
    _id: string
    firstName: string
    lastName: string
    image: string
}

interface User {
    _id: string
    firstName: string
    lastName: string
    image: string
}

type PlayScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Create"
>
type PlayScreenRouteProp = RouteProp<
    RootStackParamList,
    "Create"
>

const PlayScreen: React.FC = () => {
    const { theme } = useTheme()
    const navigation =
        useNavigation<PlayScreenNavigationProp>()
    const route = useRoute<PlayScreenRouteProp>()

    const [sport, setSport] = useState<string>("Chess")
    const [games, setGames] = useState<Game[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [upcomingGames, setUpcomingGames] = useState<
        Game[]
    >([])
    const initialOption =
        route.params?.initialOption || "My Sports"
    const [option, setOption] =
        useState<string>(initialOption)

    const { userId } = useContext(AuthContext)

    useEffect(() => {
        fetchGames()
    }, [])

    useEffect(() => {
        if (initialOption) {
            setOption(initialOption)
        }
    }, [initialOption])

    const fetchGames = async () => {
        try {
            const response = await axios.get(
                "http://10.16.13.17:3000/api/games"
            )
            setGames(response.data)
        } catch (error) {
            console.error("Failed to fetch games:", error)
        }
    }
    //console.log("games", games)

    useEffect(() => {
        if (userId) {
            fetchUpcomingGames()
        }
    }, [userId])

    useEffect(() => {
        if (userId) {
            fetchUser()
        }
    }, [userId])

    const fetchUser = async () => {
        try {
            const response = await axios.get<User>(
                `http://10.16.13.17:3000/api/auth/user/${userId}`
            )
            setUser(response.data)
        } catch (error) {
            console.error(
                "Error fetching user data:",
                error
            )
        }
    }
    useFocusEffect(
        useCallback(() => {
            if (userId) {
                fetchGames()
            }
        }, [userId])
    )

    const fetchUpcomingGames = async () => {
        try {
            //console.log("user id", userId)
            const response = await axios.get(
                `http://10.16.13.17:3000/api/games/upcoming/${userId}`
            )
            setUpcomingGames(response.data)
        } catch (error) {
            console.error(
                "Failed to fetch upcoming games:",
                error
            )
        }
    }
    //console.log("upcoming games", upcomingGames)

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

                        <Pressable
                            onPress={() =>
                                navigation.navigate(
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
                        navigation.navigate("Create", {})
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

            {option === "My Sports" && (
                <FlatList<Game>
                    showsVerticalScrollIndicator={false}
                    data={games}
                    contentContainerStyle={{
                        paddingBottom: 200
                    }}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <Game item={item} />
                    )}
                />
            )}

            {option === "Calendar" && (
                <FlatList<Game>
                    data={upcomingGames}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <UpComingGame item={item} />
                    )}
                    contentContainerStyle={{
                        paddingBottom: 20
                    }}
                />
            )}
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
