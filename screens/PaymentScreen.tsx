import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useContext, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import {
    EvilIcons,
    Feather,
    MaterialCommunityIcons
} from "@expo/vector-icons"
import { useNavigation } from "expo-router"
import { RouteProp, useRoute } from "@react-navigation/native"
import { AuthContext } from "@/context/AuthContext"
import axios from "axios"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"


type PaymentScreenRouteProp = RouteProp<
    RootStackParamList,
    "Payment"
>
type PaymentScreenNavigationProp =
    NativeStackNavigationProp<RootStackParamList, "Payment">


type PlayScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Play"
>

const PaymentScreen = () => {
    const { theme } = useTheme()

   const navigation =
       useNavigation<PaymentScreenNavigationProp>()
   const route = useRoute<PaymentScreenRouteProp>()
  
    const playNavigation =
        useNavigation<PlayScreenNavigationProp>()
   
    const total = (route.params?.price || 0) + 8.8
    console.log(route?.params)

    const [phoneNumber, setPhoneNumber] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { userId } = useContext(AuthContext)

        const courtNumber = route.params.selectedCourt
        const date = route.params.selectedDate
        const time = route.params.selectedTime
        const name = route.params.place
        const game = route.params.gameId

    //console.log("Game", game)

    const bookSlot = async () => {
        try {
            setIsLoading(true)

            // First initiate M-PESA payment
            const paymentResponse = await axios.post(
                "http://10.16.13.39:3000/api/payment/initiate",
                {
                    phoneNumber,
                    amount: total,
                    orderId: `ORDER-${Date.now()}`
                }
            )

            if (paymentResponse.data.checkoutRequestID) {
                // Show message to user to check their phone
                Alert.alert(
                    "Payment Initiated",
                    "Please check your phone for the M-PESA prompt"
                )

                // Then book the slot
                const bookingResponse = await axios.post(
                    "http://10.16.13.213:3000/api/venues/book",
                    {
                        courtNumber,
                        date: route.params.selectedDate,
                        time: route.params.selectedTime,
                        userId,
                        name: route.params.place,
                        game: route.params?.gameId
                    }
                )

                if (bookingResponse.status === 200) {
                    Alert.alert(
                        "Success",
                        "Booking successful!",
                        [
                            {
                                text: "OK",
                                onPress: () =>
                                    playNavigation.navigate(
                                        "Play"
                                    )
                            }
                        ]
                    )
                }
            }
        } catch (error) {
            console.error("Error booking slot:", error)
            Alert.alert(
                "Error",
                "Failed to process payment"
            )
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <ScrollView style={{ marginTop: 50 }}>
                <View style={{ padding: 15 }}>
                    <Text
                        style={{
                            fontSize: 23,
                            fontWeight: "500",
                            color: "green"
                        }}
                    >
                        {route.params.selectedSport}
                    </Text>

                    <View
                        style={{
                            borderColor: "#E0E0E0",
                            borderWidth: 1,
                            padding: 10,
                            marginTop: 10,
                            borderRadius: 6,
                            shadowColor: "#171717",
                            shadowOffset: {
                                width: -1,
                                height: 1
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 3
                        }}
                    >
                        <View>
                            <View
                                style={{
                                    marginVertical: 3,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 7
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="fireplace-off"
                                    size={20}
                                    color="black"
                                />
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "600"
                                    }}
                                >
                                    {
                                        route.params
                                            .selectedCourt
                                    }
                                </Text>
                            </View>
                            <View
                                style={{
                                    marginVertical: 3,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 7
                                }}
                            >
                                <Feather
                                    name="calendar"
                                    size={20}
                                    color="black"
                                />
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "600"
                                    }}
                                >
                                    {
                                        route.params
                                            .selectedDate
                                    }
                                </Text>
                            </View>
                            <View
                                style={{
                                    marginVertical: 3,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 7
                                }}
                            >
                                <Feather
                                    name="clock"
                                    size={20}
                                    color="black"
                                />
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "600"
                                    }}
                                >
                                    {
                                        route.params
                                            .selectedTime
                                    }
                                </Text>
                            </View>
                            <View
                                style={{
                                    marginVertical: 3,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 7
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="currency-rupee"
                                    size={20}
                                    color="black"
                                />
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "600"
                                    }}
                                >
                                    Kshs.{" "}
                                    {route.params.price}
                                </Text>
                            </View>
                        </View>

                        <Pressable></Pressable>
                    </View>
                </View>

                <View
                    style={{
                        marginTop: 15,
                        marginHorizontal: 15
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 7,
                            justifyContent: "space-between"
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 7
                            }}
                        >
                            <Text>Court Price</Text>
                            <EvilIcons
                                name="question"
                                size={24}
                                color="black"
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "500"
                            }}
                        >
                            Kshs. {route.params.price}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 7,
                            marginTop: 15,
                            justifyContent: "space-between"
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 7
                            }}
                        >
                            <Text>Convenience Fee</Text>
                            <EvilIcons
                                name="question"
                                size={24}
                                color="black"
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "500"
                            }}
                        >
                            Kshs. 8.8
                        </Text>
                    </View>
                </View>
                <Text
                    style={{
                        height: 1,
                        borderColor: "#E0E0E0",
                        borderWidth: 3,
                        marginTop: 20
                    }}
                />

                <View
                    style={{
                        marginHorizontal: 15,
                        marginTop: 10,
                        flexDirection: "row",
                        alignItems: "center",

                        justifyContent: "space-between"
                    }}
                >
                    <Text style={{ fontSize: 16 }}>
                        Total Amount
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "500",
                            color: "green"
                        }}
                    >
                        {total}
                    </Text>
                </View>

                <View
                    style={{
                        marginHorizontal: 15,
                        marginTop: 10,
                        borderColor: "#C0C0C0",
                        borderWidth: 2,
                        padding: 8,
                        borderRadius: 6
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",

                            justifyContent: "space-between"
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>
                            Total Amount
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: "500"
                            }}
                        >
                            To be paid at Venue
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 5,
                            justifyContent: "space-between"
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>
                            Kshs. {total}
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: "500"
                            }}
                        >
                            {total}
                        </Text>
                    </View>
                </View>
                <Text
                    style={{
                        height: 1,
                        borderColor: "#E0E0E0",
                        borderWidth: 3,
                        marginTop: 20
                    }}
                />
                <View
                    style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: 20
                    }}
                >
                    <Image
                        style={{
                            width: 100,
                            height: 80,
                            resizeMode: "contain"
                        }}
                        source={{
                            uri: "https://playo.co/_next/image?url=https%3A%2F%2Fplayo-website.gumlet.io%2Fplayo-website-v2%2FLogo%2Bwith%2BTrademark_Filled.png%3Fq%3D20%26format%3Dauto&w=3840&q=75"
                        }}
                    />
                </View>

                <Pressable
                    onPress={bookSlot}
                    style={{
                        backgroundColor: "#32CD32",
                        padding: 15,
                        marginBottom: 30,
                        borderRadius: 6,
                        marginHorizontal: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: "500",
                            color: "white"
                        }}
                    >
                        Kshs. {total}
                    </Text>
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: "500",
                            color: "white"
                        }}
                    >
                        Proceed to Pay
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PaymentScreen

const styles = StyleSheet.create({})
