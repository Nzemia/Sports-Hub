// @ts-nocheck
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
import { Entypo, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "expo-router"
import { useRoute } from "@react-navigation/native"
import { fontFamily } from "@/constants/fonts"

const PlayersScreen = () => {
    const { theme } = useTheme()

    const navigation = useNavigation()
    const route = useRoute()
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
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
                        onPress={() => navigation.goBack()}
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
                        marginTop: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            color: theme.text,
                            fontFamily: fontFamily.bold
                        }}
                    >
                        Players(
                        {route?.params?.players?.length})
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8
                        }}
                    >
                        <Ionicons
                            name="earth"
                            size={24}
                            color={theme.text}
                        />
                        <Text
                            style={{
                                color: theme.text,
                                fontFamily:
                                    fontFamily.medium
                            }}
                        >
                            Public
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{ padding: 12 }}>
                {route?.params?.players?.map(
                    (item, index) => (
                        <Pressable
                            key={index}
                            style={{
                                marginVertical: 10,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10
                            }}
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
                                    style={{
                                        color: theme.text,
                                        fontFamily:
                                            fontFamily.bold
                                    }}
                                >
                                    {item?.firstName}{" "}
                                    {item?.lastName}
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
                                        style={{
                                            fontSize: 12,
                                            color: theme.text,
                                            fontFamily:
                                                fontFamily.italic
                                        }}
                                    >
                                        INTERMEDIATE
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    )
                )}
            </View>
        </SafeAreaView>
    )
}

export default PlayersScreen

const styles = StyleSheet.create({})
