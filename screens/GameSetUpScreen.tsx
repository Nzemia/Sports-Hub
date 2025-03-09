import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native"
import React, {
    useContext,
    useEffect,
    useState
} from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import {
    Entypo,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons
} from "@expo/vector-icons"
import {
    RouteProp,
    useRoute
} from "@react-navigation/native"
import { AuthContext } from "@/context/AuthContext"
import { fontFamily } from "@/constants/fonts"
import { useNavigation } from "expo-router"
import axios from "axios"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import {
    Player,
    RequestItem,
    RootStackParamList,
    Venue
} from "@/configs/global"
import ReactNativeModal from "react-native-modal"

interface Props {
    route?: RouteProp<RootStackParamList, "Game">
    navigation?: GameSetUpScreenNavigationProp
}

type GameSetUpScreenNavigationProp =
    NativeStackNavigationProp<RootStackParamList, "Game">

type GameSetUpScreenRouteProp = RouteProp<
    RootStackParamList,
    "Game"
>

type SlotScreenScreenNavigationProp =
    NativeStackNavigationProp<RootStackParamList, "Slot">

const GameSetUpScreen = () => {
    const { theme } = useTheme()

    const navigation =
        useNavigation<GameSetUpScreenNavigationProp>()

    const slotNavigation =
        useNavigation<SlotScreenScreenNavigationProp>()

    const route = useRoute<GameSetUpScreenRouteProp>()

    const { userId } = useContext(AuthContext)

    const [modalVisible, setModalVisible] = useState(false)
    const [comment, setComment] = useState("")
    const [matchFull, setMatchFull] = useState(false)
    const [requests, setRequests] = useState<RequestItem[]>(
        []
    )
    const [players, setPlayers] = useState<Player[]>([])
    const [venues, setVenues] = useState<Venue[]>([])

    const userRequested = route?.params?.item.requests.some(
        request => request.userId === userId
    )

    const venue = venues.find(
        (item: Venue) =>
            item.name === route?.params?.item?.area
    )

    const sendJoinRequest = async (gameId: string) => {
        try {
            const response = await axios.post(
                `http://10.16.13.17:3000/api/games/${gameId}/request`,
                {
                    userId,
                    comment
                }
            )

            if (response.status == 200) {
                Alert.alert(
                    "Request Sent",
                    "Please wait for the host to accept!",
                    [
                        {
                            text: "Cancel",
                            onPress: () =>
                                console.log(
                                    "Cancel Pressed"
                                ),
                            style: "cancel"
                        },
                        {
                            text: "OK",
                            onPress: () =>
                                setModalVisible(false)
                        }
                    ]
                )
            }
            // console.log(
            //     "Request sent successfully:",
            //     response.data
            // )
        } catch (error) {
            console.error("Failed to send request:", error)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const gameId = route?.params?.item?._id
            if (!gameId) {
                console.error("No game ID found")
                return
            }

            const response = await axios.get(
                `http://10.16.13.17:3000/api/games/${gameId}/requests`
            )
            setRequests(response.data)
        } catch (error) {
            console.error(
                "Failed to fetch requests:",
                error
            )
        }
    }
    useEffect(() => {
        fetchPlayers()
    }, [])

    const fetchPlayers = async () => {
        try {
            const gameId = route?.params?.item?._id
            if (!gameId) {
                console.error("No game ID found")
                return
            }
            const response = await axios.get(
                `http://10.16.13.17:3000/api/games/${gameId}/players`
            )
            setPlayers(response.data)
        } catch (error) {
            console.error("Failed to fetch players:", error)
        }
    }

    //console.log("players", players)

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await axios.get(
                    "http://10.16.13.17:3000/api/venues"
                )
                setVenues(response.data)
            } catch (error) {
                console.error(
                    "Failed to fetch venues:",
                    error
                )
            }
        }

        fetchVenues()
    }, [])

    //console.log("ver", venue)

    const [startTime, endTime] = route?.params?.item?.time
        ?.split(" - ")
        .map(time => time.trim())

    //console.log("comment", route?.params?.item?.matchFull)

    const toggleMatchFullStatus = async (
        gameId: string
    ) => {
        try {
            const response = await axios.post(
                "http://10.16.13.17:3000/api/games/toggle-match-full",
                { gameId }
            )

            if (response.status === 200) {
                Alert.alert(
                    "Success",
                    `Match full status updated`
                )
                setMatchFull(!matchFull)
            }
        } catch (error) {
            console.error(
                "Failed to update match full status:",
                error
            )
            Alert.alert(
                "Error",
                "Failed to update match full status"
            )
        }
    }

    const renderJoinGameModal = () => {
        return (
            <ReactNativeModal
                isVisible={modalVisible}
                onBackdropPress={() =>
                    setModalVisible(false)
                }
                onBackButtonPress={() =>
                    setModalVisible(false)
                }
                swipeDirection={["up", "down"]}
                onSwipeComplete={() =>
                    setModalVisible(false)
                }
                style={{
                    justifyContent: "flex-end",
                    margin: 0
                }}
            >
                <View
                    style={[
                        styles.joinGameContainer,
                        {
                            backgroundColor: theme.secondary
                        }
                    ]}
                >
                    <Text
                        style={[
                            styles.joinGameText,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        Join Game
                    </Text>

                    <Text
                        style={[
                            styles.joinDescriptionText,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        {route?.params?.item?.adminName} has
                        been putting efforts to organize
                        this game. Please send the request
                        if you are quite sure to attend
                    </Text>

                    <View
                        style={{
                            borderColor: "#E0E0E0",
                            borderWidth: 2,
                            padding: 10,
                            borderRadius: 10,
                            height: 200,
                            marginTop: 20
                        }}
                    >
                        <TextInput
                            value={comment}
                            onChangeText={text =>
                                setComment(text)
                            }
                            style={{
                                fontFamily: "Helvetica",
                                fontSize: comment ? 14 : 12
                            }}
                            placeholder="Send a message to the host along with your request!"
                            multiline={true}
                            placeholderTextColor={"white"}
                        />
                    </View>
                    <Pressable
                        onPress={() =>
                            sendJoinRequest(
                                route?.params?.item?._id
                            )
                        }
                        style={{
                            marginTop: "auto",
                            backgroundColor: "green",
                            borderRadius: 5,
                            padding: 10
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                textAlign: "center",
                                fontSize: 15,
                                fontFamily: fontFamily.bold
                            }}
                        >
                            Send Request
                        </Text>
                    </Pressable>
                </View>
            </ReactNativeModal>
        )
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <ScrollView>
                <View
                    style={{
                        padding: 10,
                        paddingBottom: 20
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <Pressable
                            onPress={() =>
                                navigation.goBack()
                            }
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={theme.text}
                            />
                        </Pressable>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10
                            }}
                        >
                            <Entypo
                                name="share"
                                size={24}
                                color={theme.text}
                            />
                            <Entypo
                                name="dots-three-vertical"
                                size={24}
                                color={theme.text}
                            />
                        </View>
                    </View>

                    <View
                        style={{
                            marginTop: 20,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 14
                        }}
                    >
                        <Text
                            style={[
                                styles.badmintonText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            Badminton
                        </Text>

                        <View
                            style={[
                                styles.mixedDoublesContainer,
                                {
                                    backgroundColor:
                                        theme.secondary
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.mixedDoublesText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Mixed Doubles
                            </Text>
                        </View>

                        <View
                            style={{
                                marginLeft: "auto",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6
                            }}
                        >
                            <Text
                                style={[
                                    styles.matchFullText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Match Full
                            </Text>
                            <FontAwesome
                                onPress={() =>
                                    toggleMatchFullStatus(
                                        route?.params?.item
                                            ?._id
                                    )
                                }
                                name={
                                    matchFull ||
                                    route?.params?.item
                                        ?.matchFull == true
                                        ? "toggle-on"
                                        : "toggle-off"
                                }
                                size={24}
                                color={theme.text}
                            />
                        </View>
                    </View>

                    {/** date time */}
                    <View style={{ marginTop: 10 }}>
                        <Text
                            style={[
                                styles.dateTimeText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            {route?.params?.item?.time} •{" "}
                            {route?.params?.item?.date}
                        </Text>
                    </View>

                    <Pressable
                        onPress={() =>
                            slotNavigation.navigate(
                                "Slot",
                                {
                                    place: route?.params
                                        ?.item?.area,
                                    sports:
                                        venue?.sportsAvailable ||
                                        [],
                                    date: route?.params
                                        ?.item?.date,
                                    slot: route?.params
                                        ?.item?.time,
                                    startTime: startTime,
                                    endTime: endTime,
                                    gameId: route?.params
                                        ?.item?._id,
                                    bookings:
                                        venue?.bookings ||
                                        []
                                }
                            )
                        }
                        style={{
                            backgroundColor: "#28c752",
                            paddingHorizontal: 8,
                            paddingVertical: 8,
                            marginTop: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            width: "100%",
                            borderRadius: 8
                        }}
                    >
                        <Entypo
                            name="location"
                            size={20}
                            color={theme.text}
                        />

                        <View>
                            <Text
                                style={[
                                    styles.areaText,
                                    { color: theme.text }
                                ]}
                            >
                                {route?.params?.item?.area}
                            </Text>
                        </View>
                    </Pressable>
                </View>

                <View
                    style={[
                        styles.addExpenseContainer,
                        {
                            backgroundColor: theme.secondary
                        }
                    ]}
                >
                    <MaterialCommunityIcons
                        name="directions-fork"
                        size={24}
                        color="#adcf17"
                    />

                    <View>
                        <Text
                            style={[
                                styles.dateTimeText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            Add Expense
                        </Text>

                        <View
                            style={{
                                marginTop: 6,
                                flexDirection: "row",
                                justifyContent:
                                    "space-between"
                            }}
                        >
                            <Text
                                style={[
                                    styles.expensesSplitText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Start adding your expenses
                                to split cost among players
                            </Text>

                            <Entypo
                                name="chevron-small-right"
                                size={24}
                                color={theme.text}
                            />
                        </View>
                    </View>
                </View>

                <View style={{ marginHorizontal: 15 }}>
                    <Image
                        style={{
                            width: "100%",
                            height: 220,
                            borderRadius: 10,
                            resizeMode: "contain"
                        }}
                        source={{
                            uri: "https://playo.gumlet.io/OFFERS/PlayplusSpecialBadmintonOfferlzw64ucover1614258751575.png"
                        }}
                    />
                </View>

                <View
                    style={[
                        styles.playersContainer,
                        {
                            backgroundColor: theme.secondary
                        }
                    ]}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <Text
                            style={[
                                styles.playersText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            Players (2)
                        </Text>

                        <Ionicons
                            name="earth"
                            size={24}
                            color={theme.text}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 20
                        }}
                    >
                        <Text
                            style={[
                                styles.notCoveredText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            ❤️ You are not covered 🙂
                        </Text>

                        <Text
                            style={[
                                styles.matchFullText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            Learn More
                        </Text>
                    </View>

                    <View
                        style={{
                            marginVertical: 12,
                            flexDirection: "row",
                            gap: 10
                        }}
                    >
                        <View>
                            <Image
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 30
                                }}
                                source={{
                                    uri: route?.params?.item
                                        ?.adminUrl
                                }}
                            />
                        </View>

                        <View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 10
                                }}
                            >
                                <Text
                                    style={[
                                        styles.dateTimeText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    {
                                        route?.params?.item
                                            ?.adminName
                                    }
                                </Text>
                                <View
                                    style={{
                                        alignSelf:
                                            "flex-start",
                                        paddingHorizontal: 10,
                                        paddingVertical: 6,
                                        backgroundColor:
                                            "#E0E0E0",
                                        borderRadius: 8
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.hostText,
                                            {
                                                color: theme.background
                                            }
                                        ]}
                                    >
                                        HOST
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    marginTop: 10,
                                    borderRadius: 20,
                                    borderColor: "orange",
                                    borderWidth: 1,
                                    alignSelf: "flex-start"
                                }}
                            >
                                <Text
                                    style={[
                                        styles.skillsText,
                                        {
                                            color: "orange"
                                        }
                                    ]}
                                >
                                    INTERMEDIATE
                                </Text>
                            </View>
                        </View>
                    </View>

                    {route?.params?.item?.isUserAdmin ==
                    true ? (
                        <View>
                            <View
                                style={{
                                    height: 1,
                                    borderWidth: 0.5,
                                    marginVertical: 12
                                }}
                            />
                            <Pressable
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 14
                                }}
                            >
                                <View
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderWidth: 1,
                                        borderColor:
                                            "#E0E0E0",
                                        borderRadius: 30,
                                        justifyContent:
                                            "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                            resizeMode:
                                                "contain"
                                        }}
                                        source={{
                                            uri: "https://cdn-icons-png.flaticon.com/128/343/343303.png"
                                        }}
                                    />
                                </View>

                                <Text
                                    style={[
                                        styles.addCoHostText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Add Co-Host
                                </Text>

                                <MaterialCommunityIcons
                                    style={{
                                        textAlign: "center"
                                    }}
                                    name="chevron-right"
                                    size={24}
                                    color={theme.text}
                                />
                            </Pressable>

                            <View
                                style={{
                                    height: 1,
                                    borderWidth: 0.5,
                                    borderColor: "#E0E0E0",
                                    marginVertical: 12
                                }}
                            />

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent:
                                        "space-between"
                                }}
                            >
                                <Pressable>
                                    <Pressable
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderWidth: 1,
                                            borderColor:
                                                "#E0E0E0",
                                            borderRadius: 30,
                                            justifyContent:
                                                "center",
                                            alignItems:
                                                "center"
                                        }}
                                    >
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                                resizeMode:
                                                    "contain"
                                            }}
                                            source={{
                                                uri: "https://cdn-icons-png.flaticon.com/128/1474/1474545.png"
                                            }}
                                        />
                                    </Pressable>
                                    <Text
                                        style={[
                                            styles.addManageText,
                                            {
                                                color: theme.text
                                            }
                                        ]}
                                    >
                                        Add
                                    </Text>
                                </Pressable>

                                <Pressable>
                                    <Pressable
                                        onPress={() => {
                                            if (userId) {
                                                navigation.navigate(
                                                    "Manage",
                                                    {
                                                        requests:
                                                            requests,
                                                        userId: userId,
                                                        gameId: route
                                                            ?.params
                                                            ?.item
                                                            ?._id
                                                    }
                                                )
                                            }
                                        }}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderWidth: 1,
                                            borderColor:
                                                "#E0E0E0",
                                            borderRadius: 30,
                                            justifyContent:
                                                "center",
                                            alignItems:
                                                "center"
                                        }}
                                    >
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                                resizeMode:
                                                    "contain",
                                                justifyContent:
                                                    "center",
                                                alignItems:
                                                    "center"
                                            }}
                                            source={{
                                                uri: "https://cdn-icons-png.flaticon.com/128/7928/7928637.png"
                                            }}
                                        />
                                    </Pressable>
                                    <Text
                                        style={[
                                            styles.addManageText,
                                            {
                                                color: theme.text
                                            }
                                        ]}
                                    >
                                        Manage (
                                        {requests?.length})
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={() =>
                                        navigation.navigate(
                                            "Players",
                                            {
                                                players:
                                                    players
                                            }
                                        )
                                    }
                                    style={{
                                        justifyContent:
                                            "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            padding: 10,
                                            borderColor:
                                                "#E0E0E0",
                                            borderWidth: 1,
                                            justifyContent:
                                                "center",
                                            alignItems:
                                                "center",
                                            marginVertical: 12
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            style={{
                                                textAlign:
                                                    "center"
                                            }}
                                            name="chevron-right"
                                            size={20}
                                            color={
                                                theme.text
                                            }
                                        />
                                    </View>

                                    <Text
                                        style={[
                                            styles.allPlayersText,
                                            {
                                                color: theme.text
                                            }
                                        ]}
                                    >
                                        All Players
                                    </Text>
                                </Pressable>
                            </View>

                            <View
                                style={{
                                    height: 1,
                                    borderWidth: 0.5,
                                    borderColor: "#E0E0E0",
                                    marginVertical: 12
                                }}
                            />

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 15
                                }}
                            >
                                <View
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderWidth: 1,
                                        borderColor:
                                            "#E0E0E0",
                                        borderRadius: 30,
                                        justifyContent:
                                            "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                            resizeMode:
                                                "contain"
                                        }}
                                        source={{
                                            uri: "https://cdn-icons-png.flaticon.com/128/1511/1511847.png"
                                        }}
                                    />
                                </View>

                                <View>
                                    <Text
                                        style={[
                                            styles.notOnSportsHubText,
                                            {
                                                color: theme.text
                                            }
                                        ]}
                                    >
                                        Not on SportsHub?
                                        Invite
                                    </Text>
                                    <Text
                                        style={[
                                            styles.earnKarmaPointsText,
                                            {
                                                color: theme.text
                                            }
                                        ]}
                                    >
                                        Earn 100 Karma
                                        points by referring
                                        your friend
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <Pressable
                            onPress={() =>
                                navigation.navigate(
                                    "Players",
                                    {
                                        players: players
                                    }
                                )
                            }
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                borderTopColor: "#E0E0E0",
                                borderTopWidth: 1,
                                borderBottomColor:
                                    "#E0E0E0",
                                borderBottomWidth: 1,
                                marginBottom: 20
                            }}
                        >
                            <View
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    padding: 10,
                                    borderColor: "#E0E0E0",
                                    borderWidth: 1,
                                    justifyContent:
                                        "center",
                                    alignItems: "center",
                                    marginVertical: 12
                                }}
                            >
                                <MaterialCommunityIcons
                                    style={{
                                        textAlign: "center"
                                    }}
                                    name="chevron-right"
                                    size={24}
                                    color={theme.text}
                                />
                            </View>

                            <Text
                                style={[
                                    styles.allPlayersText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                All Players
                            </Text>
                        </Pressable>
                    )}
                </View>

                <View
                    style={[
                        styles.queriesContainer,
                        {
                            backgroundColor: theme.secondary
                        }
                    ]}
                >
                    <View>
                        <Text
                            style={[
                                styles.queriesText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            Queries (0)
                        </Text>

                        <View
                            style={{ marginVertical: 12 }}
                        >
                            <Text
                                style={[
                                    styles.noQueriesText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                There are no queries yet!
                                Queries sent by players will
                                be shown here
                            </Text>
                        </View>
                    </View>
                </View>

                {route?.params?.item?.isUserAdmin ==
                true ? (
                    <Pressable
                        style={{
                            backgroundColor: "#07bc0c",
                            marginTop: "auto",
                            marginBottom: 30,
                            padding: 15,
                            marginHorizontal: 10,
                            borderRadius: 4
                        }}
                    >
                        <Text style={[styles.gameChatText]}>
                            GAME CHAT
                        </Text>
                    </Pressable>
                ) : userRequested ? (
                    <Pressable
                        style={{
                            backgroundColor: "red",
                            marginTop: "auto",
                            marginBottom: 30,
                            padding: 15,
                            marginHorizontal: 10,
                            borderRadius: 4
                        }}
                    >
                        <Text
                            style={[
                                styles.cancelRequestText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            CANCEL REQUEST
                        </Text>
                    </Pressable>
                ) : (
                    <View
                        style={{
                            marginTop: "auto",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 12
                        }}
                    >
                        <Pressable
                            style={[
                                styles.sendQueryContainer,
                                {
                                    backgroundColor:
                                        theme.secondary
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.cancelJoinText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                SEND QUERY
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() =>
                                setModalVisible(
                                    !modalVisible
                                )
                            }
                            style={{
                                backgroundColor: "#07bc0c",
                                marginTop: "auto",
                                marginBottom: 30,
                                padding: 15,
                                marginHorizontal: 10,
                                borderRadius: 4,
                                flex: 1
                            }}
                        >
                            <Text
                                style={[
                                    styles.cancelJoinText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                JOIN GAME
                            </Text>
                        </Pressable>
                    </View>
                )}

                {renderJoinGameModal()}
            </ScrollView>
        </SafeAreaView>
    )
}

export default GameSetUpScreen

const styles = StyleSheet.create({
    badmintonText: {
        fontFamily: fontFamily.bold,
        fontSize: 24
    },
    mixedDoublesText: {
        fontFamily: fontFamily.medium,
        fontSize: 14
    },
    mixedDoublesContainer: {
        padding: 7,
        borderRadius: 7,
        alignSelf: "flex-start"
    },
    dateTimeText: {
        fontFamily: fontFamily.bold,
        fontSize: 14
    },
    areaText: {
        fontFamily: fontFamily.italic,
        fontSize: 12
    },
    addExpenseContainer: {
        marginVertical: 10,
        marginHorizontal: 15,
        padding: 10,
        flexDirection: "row",
        gap: 10,
        borderRadius: 10
    },
    expensesSplitText: {
        width: "80%",
        fontFamily: fontFamily.light
    },
    matchFullText: {
        fontFamily: fontFamily.bold,
        fontSize: 15
    },
    playersContainer: {
        marginVertical: 20,
        marginHorizontal: 15,
        padding: 12,
        borderRadius: 10
    },
    playersText: {
        fontFamily: fontFamily.bold,
        fontSize: 18
    },
    notCoveredText: {
        fontFamily: fontFamily.regular,
        fontSize: 15
    },
    hostText: {
        fontFamily: fontFamily.bold
    },
    skillsText: {
        fontFamily: fontFamily.italic,
        fontSize: 12
    },
    allPlayersText: {
        fontFamily: fontFamily.medium,
        fontSize: 14,
        marginBottom: 12,
        textAlign: "center"
    },
    notOnSportsHubText: {
        fontFamily: fontFamily.medium,
        fontSize: 14
    },
    queriesContainer: {
        marginHorizontal: 15,
        padding: 12,
        borderRadius: 6,
        marginBottom: 10
    },
    noQueriesText: {
        fontSize: 15,
        textAlign: "center",
        fontFamily: fontFamily.italic
    },
    gameChatText: {
        textAlign: "center",
        fontSize: 15,
        fontFamily: fontFamily.bold
    },
    queriesText: {
        fontSize: 18,
        fontFamily: fontFamily.bold
    },
    cancelRequestText: {
        textAlign: "center",
        fontSize: 15
    },
    cancelJoinText: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: fontFamily.bold
    },
    sendQueryContainer: {
        marginTop: "auto",
        marginBottom: 30,
        padding: 15,
        marginHorizontal: 10,
        borderRadius: 4,
        flex: 1,
        borderBottomEndRadius: 7
    },
    addCoHostText: {
        fontSize: 15,
        flex: 1,
        fontFamily: fontFamily.medium
    },
    addManageText: {
        fontSize: 15,
        fontFamily: fontFamily.regular,
        marginTop: 8,
        textAlign: "center"
    },
    earnKarmaPointsText: {
        marginTop: 6,
        fontFamily: fontFamily.italic,
        width: "80%"
    },
    joinGameContainer: {
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 400
    },
    joinGameText: {
        fontSize: 18,
        fontFamily: fontFamily.bold
    },
    joinDescriptionText: {
        marginTop: 15,
        fontFamily: fontFamily.medium,
        fontSize: 14
    }
})
