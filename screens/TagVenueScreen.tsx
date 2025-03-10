import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import axios from "axios"
import { Ionicons } from "@expo/vector-icons"
import { fontFamily } from "@/constants/fonts"
import { useNavigation } from "expo-router"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface Venue {
    _id: string
    name: string
    image: string
    near?: string
    rating?: number
    sportsAvailable: string[]
    bookings: any[]
}

type TagVenueScreenNavigationProp =
    NativeStackNavigationProp<
        RootStackParamList,
        "TagVenue"
    >

const TagVenueScreen = () => {
    const { theme } = useTheme()

    const navigation =
        useNavigation<TagVenueScreenNavigationProp>()

    const [venues, setVenues] = useState<Venue[]>([])
    const [taggedVenue, setTaggedVenue] =
        useState<Venue | null>(null)

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await axios.get(
                    "http://10.16.13.213:3000/api/venues"
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

    useEffect(() => {
        if (taggedVenue) {
            navigation.navigate("Create", { taggedVenue })
        }
    }, [taggedVenue, navigation])

    const handleSelectVenue = (venue: Venue) => {
        navigation.navigate("Create", {
            taggedVenue: venue
        })
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            {/**header */}
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
                        gap: 10
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

                    <Text
                        style={[
                            styles.headerText,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        Tag Venue
                    </Text>
                </View>
            </View>

            <FlatList
                data={venues}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() =>
                            handleSelectVenue(item)
                        }
                        style={{
                            padding: 10,
                            marginVertical: 10,
                            borderColor: "#e0e0e0",
                            borderWidth: 2,
                            borderRadius: 5,
                            marginHorizontal: 10
                        }}
                    >
                        <View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 10
                                }}
                            >
                                <Image
                                    style={{
                                        width: 90,
                                        height: 90,
                                        resizeMode: "cover",
                                        borderRadius: 7
                                    }}
                                    source={{
                                        uri: item?.image
                                    }}
                                />

                                <View style={{ flex: 1 }}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={[
                                            styles.nameText,
                                            {
                                                color: theme.text
                                            }
                                        ]}
                                    >
                                        {item?.name}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.nearText,
                                            {
                                                color: theme.text
                                            }
                                        ]}
                                    >
                                        {item?.near}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.ratingText,
                                            {
                                                color: theme.text
                                            }
                                        ]}
                                    >
                                        {item?.rating}
                                    </Text>
                                </View>

                                <Ionicons
                                    name="shield-checkmark-sharp"
                                    size={24}
                                    color="green"
                                />
                            </View>

                            <View>
                                <Text
                                    style={{
                                        textAlign: "center",
                                        color: "gray"
                                    }}
                                >
                                    BOOKABLE
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                )}
            />
        </SafeAreaView>
    )
}

export default TagVenueScreen

const styles = StyleSheet.create({
    headerText: {
        fontFamily: fontFamily.bold,
        fontSize: 18
    },
    nameText: {
        fontFamily: fontFamily.medium
    },
    nearText: {
        fontFamily: fontFamily.italic,
        fontSize: 14
    },
    ratingText: {
        marginTop: 8,
        fontFamily: fontFamily.regular
    }
})
