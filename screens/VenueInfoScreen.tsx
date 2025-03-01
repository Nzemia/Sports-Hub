import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import {
    RouteProp,
    useRoute
} from "@react-navigation/native"
import { fontFamily } from "@/constants/fonts"
import { RootStackParamList } from "@/configs/global"
import {
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons
} from "@expo/vector-icons"
import Amenities from "@/components/Amenities"

type VenueRouteProp = RouteProp<RootStackParamList, "Venue">

const VenueInfoScreen = () => {
    const { theme } = useTheme()

    const route = useRoute<VenueRouteProp>()

    //console.log("routes params", route.params)
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <ScrollView>
                <>
                    <View>
                        <Image
                            style={{
                                width: "100%",
                                height: 200,
                                resizeMode: "cover"
                            }}
                            source={{
                                uri: "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800"
                            }}
                        />
                    </View>

                    {/** name */}
                    <View style={{ padding: 10 }}>
                        <Text
                            style={[
                                styles.nameText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            {route?.params?.name}
                        </Text>

                        {/** time */}
                        <View
                            style={{
                                marginTop: 5,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5
                            }}
                        >
                            <Ionicons
                                name="time-outline"
                                size={24}
                                color={theme.text}
                            />
                            <Text
                                style={[
                                    styles.timeText,
                                    { color: theme.text }
                                ]}
                            >
                                6: 00 AM - 10: 00 PM
                            </Text>
                        </View>

                        {/** location */}
                        <View
                            style={{
                                marginTop: 5,
                                flexDirection: "row",
                                alignItems: "center",
                                marginVertical: 8,
                                gap: 5
                            }}
                        >
                            <Ionicons
                                name="location"
                                size={24}
                                color={theme.text}
                            />
                            <Text
                                style={[
                                    styles.locationText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                {route?.params?.location ||
                                    "Location"}
                            </Text>
                        </View>
                    </View>

                    {/** rating */}
                    <View
                        style={{
                            padding: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around"
                        }}
                    >
                        <View
                            style={{ flexDirection: "row" }}
                        >
                            {[0, 0, 0, 0, 0].map(
                                (en, index) => (
                                    <FontAwesome
                                        key={index}
                                        style={{
                                            paddingHorizontal: 3
                                        }}
                                        name={
                                            index <
                                            Math.floor(
                                                route.params
                                                    .rating
                                            )
                                                ? "star"
                                                : "star-o"
                                        }
                                        size={15}
                                        color="#FFD700"
                                    />
                                )
                            )}
                            <Text
                                style={[
                                    styles.ratingText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                {route.params.rating}
                            </Text>
                        </View>

                        <Pressable
                            style={{
                                //marginTop: 5,
                                width: 160,
                                borderColor: "#686868",
                                borderWidth: 2,
                                borderRadius: 5,
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10
                            }}
                        >
                            <Text
                                style={[
                                    styles.ratingText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Rate Venue
                            </Text>
                        </Pressable>
                    </View>

                    {/** activities */}
                    <View style={{ padding: 10 }}>
                        <View
                            style={{ flexDirection: "row" }}
                        >
                            <Text
                                style={[
                                    styles.totalActivitiesText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                18 total Activities{" "}
                            </Text>
                        </View>
                        <Pressable
                            style={{
                                marginTop: 6,
                                width: 160,
                                borderColor: "#686868",
                                borderWidth: 1,
                                borderRadius: 5,
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10
                            }}
                        >
                            <Text
                                style={[
                                    styles.upcomingText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                1 Upcoming
                            </Text>
                        </Pressable>
                    </View>

                    <Text
                        style={[
                            styles.sportsAvailableText,
                            { color: theme.text }
                        ]}
                    >
                        Sports Available
                    </Text>

                    {/** sports */}
                    <ScrollView
                        showsHorizontalScrollIndicator={
                            false
                        }
                        horizontal
                    >
                        {Array.isArray(
                            route.params.sportsAvailable
                        ) &&
                            route.params.sportsAvailable.map(
                                (item, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            borderColor:
                                                "#686868",
                                            margin: 10,
                                            padding: 20,
                                            width: 130,
                                            height: 90,
                                            borderWidth: 1,
                                            borderRadius: 5
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            style={{
                                                textAlign:
                                                    "center"
                                            }}
                                            name={item.icon}
                                            size={24}
                                            color={
                                                theme.text
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.sportsNameText,
                                                {
                                                    color: theme.text
                                                }
                                            ]}
                                        >
                                            {item.name}
                                        </Text>
                                    </View>
                                )
                            )}
                    </ScrollView>

                    {/**Amenities */}
                    <Amenities />
                </>
            </ScrollView>
        </SafeAreaView>
    )
}

export default VenueInfoScreen

const styles = StyleSheet.create({
    nameText: {
        fontSize: 20,
        fontFamily: fontFamily.bold,
        marginTop: 20
    },
    timeText: {
        fontSize: 14,
        fontFamily: fontFamily.regular
    },
    locationText: {
        fontSize: 14,
        fontFamily: fontFamily.medium
    },
    ratingText: {
        fontSize: 14,
        fontFamily: fontFamily.regular
    },
    totalActivitiesText: {
        fontSize: 14,
        fontFamily: fontFamily.regular
    },
    upcomingText: {
        fontSize: 14,
        fontFamily: fontFamily.bold
    },
    sportsAvailableText: {
        fontSize: 15,
        fontFamily: fontFamily.regular,
        marginLeft: 15
    },
    sportsNameText: {
        fontSize: 14,
        fontFamily: fontFamily.regular,
        textAlign: "center",
        marginTop: 10
    }
})
