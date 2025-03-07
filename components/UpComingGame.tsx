import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "expo-router"
import { fontFamily } from "@/constants/fonts"

type GameScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Game"
>

const UpComingGame = ({ item }: any) => {
    const { theme } = useTheme()

    const navigation =
        useNavigation<GameScreenNavigationProp>()
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
                            {item?.adminName}'s Badminton
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
                            {item?.area}
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
                            }}
                        >
                            {item?.isBooked ? (
                                <>
                                    <Text
                                        style={[
                                            styles.countNumber,
                                            {
                                                color: theme.text
                                            }
                                        ]}
                                    >
                                        {item?.courtNumber}
                                    </Text>

                                    <View
                                        style={{
                                            justifyContent:
                                                "center",
                                            alignItems:
                                                "center",
                                            backgroundColor:
                                                "#56cc79",
                                            paddingVertical: 5
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.bookedText,
                                                {
                                                    color: theme.text
                                                }
                                            ]}
                                        >
                                            Booked
                                        </Text>
                                    </View>
                                </>
                            ) : (
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
                                    02:00 PM - 06:00 PM
                                </Text>
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
        fontSize: 13,
        fontFamily: fontFamily.medium
    },
    goingText: {
        fontFamily: fontFamily.bold,
        fontSize: 18,
        marginTop: 10
    }
})
