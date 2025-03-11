// @ts-nocheck
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useContext } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import {
    Feather,
    SimpleLineIcons
} from "@expo/vector-icons"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "expo-router"
import { fontFamily } from "@/constants/fonts"
import { AuthContext } from "@/context/AuthContext"

interface Player {
    name: string
    imageUrl: string
}

interface RequestItem {
    userId: string
}

interface GameItem {
    _id: string
    adminUrl: string
    adminName: string
    players: Player[]
    totalPlayers: number
    date: string
    time: string
    area: string
    matchFull: boolean
    isUserAdmin: boolean
    requests: RequestItem[]
}

interface GameProps {
    item: GameItem
    isUserInRequests?: boolean
}

type GameScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Game"
>

const Game: React.FC<GameProps> = ({ item }) => {
    const { theme } = useTheme()
    const navigation =
        useNavigation<GameScreenNavigationProp>()
    const { userId, setUserId } = useContext(AuthContext)
    const isUserInRequests = item?.requests.some(
        request => request.userId === userId
    )

    // const handleJoinRequest = () => {
    //     if (!item.isPublic) {
    //         Alert.alert(
    //             "Private Game",
    //             "This is a private game. You need an invitation to join."
    //         )
    //         return
    //     }
    // }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <Pressable
                onPress={() =>
                    navigation.navigate("Game", {
                        item: item
                    })
                }
                style={[
                    styles.container,
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
                            styles.regularText,
                            { color: theme.text }
                        ]}
                    >
                        Regular
                    </Text>
                    <Feather
                        name="bookmark"
                        size={24}
                        color={theme.text}
                    />
                </View>

                <View style={{ marginTop: 10 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <View
                            style={{ flexDirection: "row" }}
                        >
                            <Image
                                style={{
                                    width: 43,
                                    height: 43,
                                    borderRadius: 28
                                }}
                                source={{
                                    uri: item?.adminUrl
                                }}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginLeft: -7
                                }}
                            >
                                {item?.players
                                    ?.filter(
                                        c =>
                                            c?.name !==
                                            item?.adminName
                                    )
                                    .map(
                                        (player, index) => (
                                            <Image
                                                key={index}
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 22,
                                                    marginLeft:
                                                        -7
                                                }}
                                                source={{
                                                    uri: player?.imageUrl
                                                }}
                                            />
                                        )
                                    )}
                            </View>
                        </View>

                        <View
                            style={{
                                marginLeft: 10,
                                flex: 1
                            }}
                        >
                            <Text
                                style={[
                                    styles.goingText,
                                    { color: theme.text }
                                ]}
                            >
                                • {item?.players.length}/
                                {item?.totalPlayers} Going
                            </Text>
                        </View>

                        <View
                            style={{
                                paddingHorizontal: 8,
                                paddingVertical: 6,
                                backgroundColor: "#fffbde",
                                borderRadius: 8,
                                borderColor: "#EEDC82",
                                borderWidth: 1
                            }}
                        >
                            <Text
                                style={[
                                    styles.slotsLeftText,
                                    {
                                        color: theme.background
                                    }
                                ]}
                            >
                                Only{" "}
                                {item?.totalPlayers -
                                    item?.players
                                        .length}{" "}
                                slots left 🚀
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <View>
                            <Text
                                style={[
                                    styles.nameKarmaText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                {item?.adminName} | 321
                                Karma | On Fire
                            </Text>

                            <Text
                                style={[
                                    styles.dateText,
                                    { color: theme.text }
                                ]}
                            >
                                {item?.date}, {item?.time}
                            </Text>
                        </View>

                        <View>
                            {item?.matchFull && (
                                <Image
                                    style={{
                                        width: 100,
                                        height: 70,
                                        resizeMode:
                                            "contain"
                                    }}
                                    source={{
                                        uri: "https://playo.co/_next/image?url=https%3A%2F%2Fplayo-website.gumlet.io%2Fplayo-website-v3%2Fmatch_full.png&w=256&q=75"
                                    }}
                                />
                            )}
                        </View>
                    </View>

                    <View
                        style={{
                            marginTop: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 7
                        }}
                    >
                        <SimpleLineIcons
                            name="location-pin"
                            size={20}
                            color={theme.text}
                        />
                        <Text
                            style={[
                                styles.nameKarmaText,
                                { color: theme.text }
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item?.area}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "#E0E0E0",
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 8,
                                marginTop: 12,
                                alignSelf: "flex-start"
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: "400"
                                }}
                            >
                                Intermediate to Advanced
                            </Text>
                        </View>
                        {isUserInRequests && (
                            <View
                                style={{
                                    backgroundColor:
                                        "yellow",
                                    paddingHorizontal: 10,
                                    paddingVertical: 4,
                                    borderRadius: 5,
                                    marginTop: 10
                                }}
                            >
                                <View>
                                    <Text
                                        style={[
                                            styles.requestedText,
                                            {
                                                color: theme.background
                                            }
                                        ]}
                                    >
                                        Requested
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* {!item.isUserAdmin &&
                            !item.matchFull && (
                                <Pressable
                                    onPress={
                                        handleJoinRequest
                                    }
                                    style={[
                                        styles.joinButton,
                                        !item.isPublic &&
                                            styles.disabledButton
                                    ]}
                                    disabled={
                                        !item.isPublic
                                    }
                                >
                                    <Text
                                        style={
                                            styles.joinButtonText
                                        }
                                    >
                                        {item.isPublic
                                            ? "Join Game"
                                            : "Private Game"}
                                    </Text>
                                </Pressable>
                            )} */}
                    </View>
                </View>
            </Pressable>
        </SafeAreaView>
    )
}

export default Game

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 14,
        padding: 14,
        borderRadius: 10
    },
    regularText: {
        fontSize: 16,
        fontFamily: fontFamily.bold
    },
    goingText: {
        fontSize: 14,
        fontFamily: fontFamily.medium
    },
    slotsLeftText: {
        fontSize: 14,
        fontFamily: fontFamily.italic
    },
    nameKarmaText: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        marginTop: 10
    },
    dateText: {
        fontSize: 14,
        fontFamily: fontFamily.bold,
        marginTop: 10
    },
    areaText: {
        fontFamily: fontFamily.regular,
        fontSize: 15,
        flex: 1
    },
    requestedText: {
        fontFamily: fontFamily.bold,
        fontSize: 14,
        textAlign: "center"
    }
})
