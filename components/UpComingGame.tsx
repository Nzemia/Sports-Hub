import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import {
    RootStackParamList,
    UpComingGameProps
} from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "expo-router"
import { fontFamily } from "@/constants/fonts"

type GameScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Game"
>

const UpComingGame: React.FC<UpComingGameProps> = ({
    item
}) => {
    const { theme } = useTheme()

    const navigation =
        useNavigation<GameScreenNavigationProp>()

    const [isBooked, setIsBooked] = useState(item?.isBooked)
    const [courtNumber, setCourtNumber] = useState(
        item?.courtNumber
    )
    useEffect(() => {
        setIsBooked(item?.isBooked)
        setCourtNumber(item?.courtNumber)
    }, [item?.isBooked, item?.courtNumber])
    //console.log("item", item)

    const renderBookingStatus = () => (
        <View
            style={{
                marginVertical: 10,
                padding: isBooked ? 0 : 15,
                borderRadius: 8,
                borderColor: "#E0E0E0",
                borderWidth: 2,
                width: "100%"
            }}
        >
            {isBooked ? (
                <>
                    <Text
                        style={[
                            styles.countNumber,
                            { color: theme.text }
                        ]}
                    >
                        {courtNumber}
                    </Text>
                    <View style={styles.bookedBadge}>
                        <Text style={styles.bookedText}>
                            Booked
                        </Text>
                    </View>
                </>
            ) : (
                <Text
                    style={[
                        styles.availableText,
                        { color: theme.text }
                    ]}
                >
                    Available
                </Text>
            )}
        </View>
    )
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
                        item: {
                            ...item
                        }
                    })
                }
                style={[
                    styles.container,
                    {
                        backgroundColor: theme.secondary
                    }
                ]}
            >
                <Text
                    style={[
                        styles.dateText,
                        {
                            color: theme.text
                        }
                    ]}
                >
                    {item?.date}
                </Text>

                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        marginTop: 12
                    }}
                >
                    {/* Admin Image */}
                    <View>
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20
                            }}
                            source={{ uri: item?.adminUrl }}
                        />
                    </View>

                    {/* Main Content */}
                    <View style={{ flex: 1 }}>
                        <Text
                            style={[
                                styles.adminsGameText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            {item?.adminName}'s {""}
                            Game
                        </Text>

                        <Text
                            style={[
                                styles.areaText,
                                {
                                    color: theme.text
                                }
                            ]}
                            numberOfLines={2}
                        >
                            {item?.area ||
                                "Location not specified"}
                        </Text>

                        <View
                            style={{
                                marginVertical: 10,
                                padding: item?.isBooked
                                    ? 0
                                    : 15,
                                borderRadius: 8,
                                borderColor: "#E0E0E0",
                                borderWidth: 2,
                                width: "100%"
                                //backgroundColor: "#56cc79"
                            }}
                        >
                            {item?.isBooked ? (
                                renderBookingStatus()
                            ) : (
                                <View>
                                    <Text
                                        style={[
                                            styles.bookedText,

                                            {
                                                color: theme.text,
                                                textAlign:
                                                    "center",
                                                fontFamily:
                                                    fontFamily.bold
                                            }
                                        ]}
                                    >
                                        Available
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Player Count */}
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: 8
                        }}
                    >
                        <Text
                            style={[
                                styles.goingText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            {item?.players?.length}
                        </Text>
                        <Text
                            style={[
                                styles.goingText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            GOING
                        </Text>
                    </View>
                </View>
            </Pressable>
        </SafeAreaView>
    )
}

export default UpComingGame

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 2,
        marginBottom: 20
    },
    dateText: {
        marginVertical: 7,
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 2,
        fontFamily: fontFamily.bold
    },
    adminsGameText: {
        fontFamily: fontFamily.medium,
        fontSize: 14,
        flexWrap: "wrap",
        marginBottom: 6
    },
    areaText: {
        fontFamily: fontFamily.italic,
        fontSize: 14,
        marginBottom: 10,
        flexShrink: 1
    },
    countNumber: {
        fontFamily: fontFamily.bold,
        textAlign: "center",
        fontSize: 13,
        paddingVertical: 10
    },
    bookedText: {
        fontSize: 14,
        fontFamily: fontFamily.bold
    },
    goingText: {
        fontFamily: fontFamily.bold,
        fontSize: 18,
        marginTop: 10
    }
})
