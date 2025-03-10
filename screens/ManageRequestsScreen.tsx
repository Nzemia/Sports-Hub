import {
    Alert,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import { AntDesign, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "expo-router"
import { fontFamily } from "@/constants/fonts"
import {
    RouteProp,
    useRoute
} from "@react-navigation/native"
import axios from "axios"
import {
    Player,
    RequestUser,
    RootStackParamList
} from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type ManageRequestsScreenRouteProp = RouteProp<
    RootStackParamList,
    "Manage"
>
type ManageRequestsScreenNavigationProp =
    NativeStackNavigationProp<RootStackParamList, "Manage">

const ManageRequestsScreen = () => {
    const { theme } = useTheme()

    const navigation = useNavigation()

    const requestsNavigation =
        useNavigation<ManageRequestsScreenNavigationProp>()
    const route = useRoute<ManageRequestsScreenRouteProp>()

    const { userId, gameId } = route.params
    //console.log(userId)
    //console.log(gameId)

    const [option, setOption] = useState("Requests")
    const [requests, setRequests] = useState<RequestUser[]>(
        []
    )
    const [players, setPlayers] = useState<Player[]>([])

    useEffect(() => {
        fetchRequests()
    }, [])

    const acceptRequest = async (userId: string) => {
        try {
            const user = {
                gameId: gameId,
                userId: userId
            }
            console.log(user)
            const response = await axios.post(
                "http://10.16.13.213:3000/api/games/accept",
                user
            )

            if (response.status === 200) {
                Alert.alert("Success", "Request accepted")

                await fetchRequests()

                await fetchPlayers()
            }
        } catch (error) {
            console.error(
                "Failed to accept request:",
                error
            )
        }
    }

    const fetchRequests = async () => {
        try {
            const response = await axios.get(
                `http://10.16.13.213:3000/api/games/${gameId}/requests`
            )
            setRequests(response.data)
        } catch (error) {
            console.error(
                "Failed to fetch requests:",
                error
            )
        }
    }

    const fetchPlayers = async () => {
        try {
            const response = await axios.get(
                `http://10.16.13.213:3000/api/games/${gameId}/players`
            )
            setPlayers(response.data)
        } catch (error) {
            console.error("Failed to fetch players:", error)
        }
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            {/** headers */}
            <View
                style={{
                    padding: 12,
                    backgroundColor: "#223536"
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        justifyContent: "space-between"
                    }}
                >
                    <Pressable
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={theme.text}
                        />
                    </Pressable>
                    <AntDesign
                        name="plussquareo"
                        size={24}
                        color={theme.text}
                    />
                </View>

                <View
                    style={{
                        marginTop: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        justifyContent: "space-between"
                    }}
                >
                    <Text
                        style={[
                            styles.headerText,
                            { color: theme.text }
                        ]}
                    >
                        Manage
                    </Text>

                    <View>
                        <Text
                            style={[
                                styles.matchFullText,
                                { color: theme.text }
                            ]}
                        >
                            Match Full
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        marginTop: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 15
                    }}
                >
                    <Pressable
                        onPress={() =>
                            setOption("Requests")
                        }
                    >
                        <Text
                            style={{
                                fontFamily:
                                    fontFamily.medium,
                                color:
                                    option == "Requests"
                                        ? "#1dd132"
                                        : "white"
                            }}
                        >
                            Requests ({requests?.length})
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setOption("Invited")}
                    >
                        <Text
                            style={{
                                fontFamily:
                                    fontFamily.medium,
                                color:
                                    option == "Invited"
                                        ? "#1dd132"
                                        : "white"
                            }}
                        >
                            Invited (0)
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setOption("Playing")}
                    >
                        <Text
                            style={{
                                fontFamily:
                                    fontFamily.medium,
                                color:
                                    option == "Playing"
                                        ? "#1dd132"
                                        : "white"
                            }}
                        >
                            Playing({players?.length})
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setOption("Retired")}
                    >
                        <Text
                            style={{
                                fontFamily:
                                    fontFamily.medium,
                                color:
                                    option == "Retired"
                                        ? "#1dd132"
                                        : "white"
                            }}
                        >
                            Retired(0)
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/** Requests */}
            <View
                style={{
                    marginTop: 10,
                    marginHorizontal: 15
                }}
            >
                <View>
                    {option == "Requests" && (
                        <View>
                            {requests?.map(
                                (
                                    item: RequestUser,
                                    index
                                ) => (
                                    <Pressable
                                        style={{
                                            padding: 10,
                                            marginVertical: 10,
                                            borderRadius: 6
                                        }}
                                        key={index}
                                    >
                                        <View
                                            style={{
                                                flexDirection:
                                                    "row",
                                                alignItems:
                                                    "center",
                                                gap: 13
                                            }}
                                        >
                                            <Image
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 25
                                                }}
                                                source={{
                                                    uri: item?.image
                                                }}
                                            />

                                            <View
                                                style={{
                                                    flex: 1
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        styles.nameText,
                                                        {
                                                            color: theme.text
                                                        }
                                                    ]}
                                                >
                                                    {
                                                        item?.firstName
                                                    }{" "}
                                                    {
                                                        item?.lastName
                                                    }
                                                </Text>
                                                <View
                                                    style={{
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 3,
                                                        marginTop: 10,
                                                        borderRadius: 20,
                                                        borderColor:
                                                            "orange",
                                                        borderWidth: 1,
                                                        alignSelf:
                                                            "flex-start"
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.skillsText,
                                                            {
                                                                color: theme.text
                                                            }
                                                        ]}
                                                    >
                                                        INTERMEDIATE
                                                    </Text>
                                                </View>
                                            </View>

                                            <View>
                                                <Image
                                                    style={{
                                                        width: 110,
                                                        height: 60,
                                                        resizeMode:
                                                            "contain"
                                                    }}
                                                    source={{
                                                        uri: "https://playo-website.gumlet.io/playo-website-v2/logos-icons/new-logo-playo.png?q=50"
                                                    }}
                                                />
                                            </View>
                                        </View>

                                        <Text
                                            style={[
                                                styles.commentText,
                                                {
                                                    color: theme.text
                                                }
                                            ]}
                                        >
                                            {item?.comment}
                                        </Text>

                                        <View
                                            style={{
                                                height: 1,
                                                borderColor:
                                                    "#E0E0E0",
                                                borderWidth: 0.7,
                                                marginVertical: 15
                                            }}
                                        />

                                        <View
                                            style={{
                                                flexDirection:
                                                    "row",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "space-between"
                                            }}
                                        >
                                            <View>
                                                <View
                                                    style={{
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 4,
                                                        backgroundColor:
                                                            "#E0E0E0",
                                                        borderRadius: 5,
                                                        alignSelf:
                                                            "flex-start"
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.showsText,
                                                            {
                                                                color: theme.background
                                                            }
                                                        ]}
                                                    >
                                                        0 NO
                                                        SHOWS
                                                    </Text>
                                                </View>

                                                <Text
                                                    style={[
                                                        styles.reputationText,
                                                        {
                                                            color: theme.text
                                                        }
                                                    ]}
                                                >
                                                    See
                                                    Reputation
                                                </Text>
                                            </View>

                                            <View
                                                style={{
                                                    flexDirection:
                                                        "row",
                                                    alignItems:
                                                        "center",
                                                    gap: 12
                                                }}
                                            >
                                                <Pressable
                                                    style={{
                                                        padding: 10,
                                                        borderRadius: 6,
                                                        borderColor:
                                                            "#E0E0E0",
                                                        borderWidth: 1,
                                                        width: 100,
                                                        backgroundColor:
                                                            "red"
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.nameText,
                                                            {
                                                                color: theme.text,
                                                                textAlign:
                                                                    "center"
                                                            }
                                                        ]}
                                                    >
                                                        DECLINE
                                                    </Text>
                                                </Pressable>

                                                <Pressable
                                                    onPress={() =>
                                                        acceptRequest(
                                                            item.userId
                                                        )
                                                    }
                                                    style={{
                                                        padding: 10,
                                                        borderRadius: 6,
                                                        backgroundColor:
                                                            "#26bd37",
                                                        width: 100
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.nameText,
                                                            {
                                                                color: theme.text,
                                                                textAlign:
                                                                    "center"
                                                            }
                                                        ]}
                                                    >
                                                        ACCEPT
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </Pressable>
                                )
                            )}
                        </View>
                    )}
                </View>
            </View>

            {/** Playing */}
            <View
                style={{
                    marginTop: 10,
                    marginHorizontal: 15
                }}
            >
                <View>
                    {option == "Playing" && (
                        <>
                            <View style={{}}>
                                {players?.map(
                                    (
                                        item: Player,
                                        index
                                    ) => (
                                        <Pressable
                                            style={{
                                                marginVertical: 10,
                                                flexDirection:
                                                    "row",
                                                alignItems:
                                                    "center",
                                                gap: 10
                                            }}
                                            key={index}
                                        >
                                            <View>
                                                <Image
                                                    style={{
                                                        width: 60,
                                                        height: 60,
                                                        borderRadius: 30
                                                    }}
                                                    source={{
                                                        uri: item?.image
                                                    }}
                                                />
                                            </View>

                                            <View>
                                                <Text
                                                    style={[
                                                        styles.nameText,
                                                        {
                                                            color: theme.text
                                                        }
                                                    ]}
                                                >
                                                    {
                                                        item?.firstName
                                                    }{" "}
                                                    {
                                                        item?.lastName
                                                    }
                                                </Text>

                                                <View
                                                    style={{
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 5,
                                                        marginTop: 10,
                                                        borderRadius: 20,
                                                        borderColor:
                                                            "orange",
                                                        borderWidth: 1,
                                                        alignSelf:
                                                            "flex-start"
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.skillsText,
                                                            {
                                                                color: theme.text
                                                            }
                                                        ]}
                                                    >
                                                        INTERMEDIATE
                                                    </Text>
                                                </View>
                                            </View>
                                        </Pressable>
                                    )
                                )}
                            </View>
                        </>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ManageRequestsScreen

const styles = StyleSheet.create({
    headerText: {
        fontSize: 22,
        fontFamily: fontFamily.bold
    },
    matchFullText: {
        fontSize: 17,
        fontFamily: fontFamily.medium
    },
    nameText: {
        fontSize: 17,
        fontFamily: fontFamily.bold
    },
    skillsText: {
        fontSize: 13,
        fontFamily: fontFamily.regular
    },
    commentText: {
        marginTop: 8,
        fontSize: 14,
        fontFamily: fontFamily.light
    },
    showsText: {
        fontSize: 13,
        fontFamily: fontFamily.regular
    },
    reputationText: {
        fontSize: 13,
        fontFamily: fontFamily.regular,
        marginTop: 5
    }
})
