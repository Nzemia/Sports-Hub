import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native"
import React, { useContext, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import {
    useNavigation,
    useRoute
} from "@react-navigation/native"
import { AuthContext } from "@/context/AuthContext"
import axios from "axios"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RouteProp } from "@react-navigation/native"
import { fontFamily } from "@/constants/fonts"

type PaymentScreenRouteProp = RouteProp<
    RootStackParamList,
    "Payment"
>
type PaymentScreenNavigationProp =
    NativeStackNavigationProp<RootStackParamList, "Payment">

const PaymentScreen: React.FC = () => {
    const { theme } = useTheme()
    const navigation =
        useNavigation<PaymentScreenNavigationProp>()
    const route = useRoute<PaymentScreenRouteProp>()
    const { userId } = useContext(AuthContext)

    const [phoneNumber, setPhoneNumber] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const total = (route.params?.price || 0) + 8.8
    const orderId = `ORDER-${new Date().getTime()}`

    const bookSlot = async () => {
        if (!phoneNumber) {
            Alert.alert(
                "Error",
                "Please enter your phone number"
            )
            return
        }

        // Validate phone number format
        const phoneRegex = /^(?:254|\+254|0)?([0-9]{9})$/
        if (!phoneRegex.test(phoneNumber)) {
            Alert.alert(
                "Error",
                "Invalid phone number format. Use format: 254XXXXXXXXX or 07XXXXXXXX"
            )
            return
        }

        try {
            setIsLoading(true)

            // Format phone number if needed
            const formattedPhone = phoneNumber.startsWith(
                "254"
            )
                ? phoneNumber
                : `254${phoneNumber.replace(/^0/, "")}`

            const paymentResponse = await axios.post(
                "http://10.16.13.213:3000/api/payment/initiate",
                {
                    phoneNumber: formattedPhone,
                    amount: Math.round(total),
                    orderId: `ORDER-${Date.now()}`
                }
            )

            if (paymentResponse.data.checkoutRequestID) {
                Alert.alert(
                    "Payment Initiated",
                    "Please check your phone for the M-PESA prompt"
                )

                const bookingResponse = await axios.post(
                    "http://10.16.13.213:3000/api/venues/book",
                    {
                        courtNumber:
                            route.params.selectedCourt,
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
                                    navigation.navigate(
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
            style={[
                styles.container,
                { backgroundColor: theme.background }
            ]}
        >
            <View style={styles.content}>
                <Text
                    style={[
                        styles.title,
                        {
                            color: theme.text
                        }
                    ]}
                >
                    Payment Details
                </Text>

                <View style={[styles.summary]}>
                    <Text style={[styles.summaryText]}>
                        Total Amount: KES {total.toFixed(2)}
                    </Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text
                        style={[
                            styles.label,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        M-Pesa Phone Number
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                color: theme.text
                            }
                        ]}
                        placeholder="Enter your M-Pesa number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        maxLength={12}
                        placeholderTextColor={theme.text}
                    />
                </View>

                <Pressable
                    onPress={bookSlot}
                    disabled={isLoading}
                    style={[
                        styles.payButton,
                        isLoading && styles.disabledButton
                    ]}
                >
                    <Text
                        style={[
                            styles.payButtonText,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        {isLoading
                            ? "Processing..."
                            : `Pay KES ${total.toFixed(2)}`}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default PaymentScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        padding: 20
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontFamily: fontFamily.bold
    },
    summary: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: "#9DB2CE"
    },
    summaryText: {
        fontSize: 16,
        fontFamily: fontFamily.medium
    },
    inputContainer: {
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontFamily: fontFamily.regular
    },
    input: {
        borderWidth: 2,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        fontFamily: fontFamily.medium
    },
    payButton: {
        backgroundColor: "#32CD32",
        padding: 16,
        borderRadius: 8,
        alignItems: "center"
    },
    disabledButton: {
        backgroundColor: "#a0a0a0"
    },
    payButtonText: {
        color: "white",
        fontSize: 20,
        fontFamily: fontFamily.extraBold
    }
})
