// @ts-nocheck

import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import {
    Ionicons,
    MaterialCommunityIcons
} from "@expo/vector-icons"
import { useNavigation } from "expo-router"
import {
    RouteProp,
    useRoute
} from "@react-navigation/native"
import moment, { Moment } from "moment"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import {
    RootStackParamList,
    SlotScreenParams
} from "@/configs/global"
import Calendar from "@/components/Calendar"
import { fontFamily } from "@/constants/fonts"

type SlotScreenRouteProp = RouteProp<
    RootStackParamList,
    "Slot"
>
type SlotScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Slot"
>

type PaymentScreenNavigationProp =
    NativeStackNavigationProp<RootStackParamList, "Payment">

interface TimeSlot {
    time: string
    status: boolean
}

interface DateProps {
    date: Moment
    setSelectedTime: (time: string) => void
    onSelectDate: (date: string) => void
    selected: string
}

const SlotScreen = () => {
    const { theme } = useTheme()

    const navigation =
        useNavigation<SlotScreenNavigationProp>()

    const payNavigation =
        useNavigation<PaymentScreenNavigationProp>()
    const route = useRoute<SlotScreenRouteProp>()
    const params = route.params

    //const params = route.params as SlotScreenParams

    const today = moment().format("YYYY-MM-DD")

    // console.log(today)
    const [selectedDate, setSelectedDate] =
        useState<string>(moment().format("YYYY-MM-DD"))
    const [selectedTime, setSelectedTime] =
        useState<string>("")
    const [selectedCourt, setSelectedCourt] =
        useState<string>("")
    const [selectedSport, setSelectedSport] =
        useState<string>(params.sports[0].name)
    const [duration, setDuration] = useState<number>(60)
    const [timeOver, setTimeOver] = useState<boolean[]>([])
    const [checkedTimes, setCheckedTimes] = useState<
        TimeSlot[]
    >([])
    const [timess, setTimes] = useState<string[]>([])
    //   const {paymentStatus, setPaymentStatus} = useContext(CartItems);
    //   console.log(paymentStatus);

    //console.log(route.params)

    const price =
        params.sports.find(s => s.name === selectedSport)
            ?.price || 0
    // console.log(price);
    // console.log(route.params);

    const courts = route.params.sports.filter(
        item => item.name === selectedSport
    )

    //console.log(selectedSport)
    // console.log(courts);
    const d = moment().format("LT")

    const checkTime = (current: string, time: string) => {
        const beginningTime = moment(current, "h:mma")
        const endTime = moment(time, "h:mma")
        setTimeOver([beginningTime.isAfter(endTime)])
    }

    const [isOver, setIsOver] = useState(false)

    const generateTimes = () => {
        const start = moment(selectedDate)
            .startOf("day")
            .add(6, "hours")
        const end = moment(selectedDate).endOf("day")
        const interval = 60
        const result: string[] = []
        let current = moment(start)

        while (current <= end) {
            result.push(current.format("h:mma"))
            current.add(interval, "minutes")
        }
        setTimes(result)
    }

    useEffect(() => {
        generateTimes()
    }, [selectedDate])

    useEffect(() => {
        //console.log("times thererer", timess)
        timess.map((item, index) => {
            const lastTime = moment(item, "h:mm A")
            const currentTime = moment()

            const status = currentTime.isAfter(lastTime)

            timeOver.push(status)
        })
    }, [selectedDate])

    var times = []
    useEffect(() => {
        const checkTime = () => {
            const currentDateTime = moment() // Current date and time
            const selectedDateStart =
                moment(selectedDate).startOf("day") // Start of the selected date

            const times = timess.map(item => {
                // Combine the selected date with the current time slot to create a full date-time
                const dateTime = moment(
                    selectedDateStart
                ).set({
                    hour: moment(item, "h:mma").get("hour"),
                    minute: moment(item, "h:mma").get(
                        "minute"
                    )
                })

                // Determine if the time slot is in the past or future
                const status =
                    currentDateTime.isBefore(dateTime)
                return { time: item, status: status }
            })

            setCheckedTimes(times)
        }

        checkTime()
    }, [selectedDate, timess])

    const todayy = new Date()

    useEffect(() => {
        if (route.params?.date) {
            const gameDate = route.params.date
            //console.log("gameDate:", gameDate)

            // Match the day and month from '29th July'
            const parts = gameDate.match(
                /(\d+)(st|nd|rd|th)?\s(\w+)/
            )
            if (parts) {
                const day = parseInt(parts[1], 10)
                const monthString = parts[3]
                // console.log(
                //     "day:",
                //     day,
                //     "monthString:",
                //     monthString
                // )

                const monthNames = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ]

                const month =
                    monthNames.indexOf(monthString)
                const year = todayy.getFullYear()

                if (!isNaN(day) && month !== -1) {
                    // Create a new Date object
                    const formattedDate = new Date(
                        year,
                        month,
                        day
                    )

                    // console.log(
                    //     "formattedDate:",
                    //     formattedDate
                    // )
                    if (
                        formattedDate.toString() !==
                        "Invalid Date"
                    ) {
                        setSelectedDate(formattedDate)
                    } else {
                        console.error(
                            "Formatted date is invalid"
                        )
                    }
                } else {
                    console.error(
                        "Invalid day or month:",
                        day,
                        month
                    )
                }
            } else {
                console.error(
                    "Date parsing failed:",
                    gameDate
                )
            }
        }
    }, [route.params?.date])

    const time = route?.params?.slot

    const calculateEndTime = (
        startTime: string,
        duration: number
    ): string => {
        if (typeof startTime !== "string") {
            console.error("Invalid startTime:", startTime)
            return ""
        }

        const match = startTime.match(
            /(\d+:\d+)([APMapm]+)/
        )
        if (!match) {
            console.error(
                "Invalid startTime format:",
                startTime
            )
            return ""
        }

        let [hours, minutes] = match[1]
            .split(":")
            .map(Number)
        const modifier = match[2].toUpperCase()

        if (modifier === "PM" && hours < 12) hours += 12
        if (modifier === "AM" && hours === 12) hours = 0

        const totalMinutes = hours * 60 + minutes + duration
        let endHours = Math.floor(totalMinutes / 60)
        let endMinutes = totalMinutes % 60

        // Format the end time
        let endModifier = endHours >= 12 ? "PM" : "AM"
        if (endHours >= 24) {
            endHours -= 24
            endModifier = "AM"
        }
        if (endHours >= 12) {
            endModifier = "PM"
            if (endHours > 12) endHours -= 12
        }
        if (endHours === 0) {
            endHours = 12
            endModifier = "AM"
        }

        const formattedEndHours = endHours
            .toString()
            .padStart(2, "0")
        const formattedEndMinutes = endMinutes
            .toString()
            .padStart(2, "0")

        return `${formattedEndHours}:${formattedEndMinutes} ${endModifier}`
    }

    const isSlotBooked = (time: string): boolean => {
        return route?.params?.bookings.some(booking => {
            // Check if the booking is on the selected date
            if (booking.date !== selectedDate) return false

            // Extract the start and end times from the booking time range
            const [startTime, endTime] =
                booking.time.split(" - ")

            // Get the hour portion of the times to compare
            let chosenHour = parseInt(
                time.split(":")[0],
                10
            )
            let startHour = parseInt(
                startTime.split(":")[0],
                10
            )
            let endHour = parseInt(
                endTime.split(":")[0],
                10
            )

            // Convert times to lowercase for consistent AM/PM checks
            const lowerStartTime = startTime.toLowerCase()
            const lowerEndTime = endTime.toLowerCase()
            const lowerChosenTime = time.toLowerCase()

            // console.log("lower", lowerChosenTime)
            // console.log("hihger", lowerEndTime)

            // Handle AM/PM for the start time
            if (
                lowerStartTime.includes("pm") &&
                startHour < 12
            )
                startHour += 12
            if (
                lowerStartTime.includes("am") &&
                startHour === 12
            )
                startHour = 0

            // Handle AM/PM for the end time
            if (lowerEndTime.includes("pm") && endHour < 12)
                endHour += 12
            if (
                lowerEndTime.includes("am") &&
                endHour === 12
            )
                endHour = 0

            // Handle AM/PM for the chosen time
            if (
                lowerChosenTime.includes("pm") &&
                chosenHour < 12
            )
                chosenHour += 12
            if (
                lowerChosenTime.includes("am") &&
                chosenHour === 12
            )
                chosenHour = 0

            return (
                chosenHour >= startHour &&
                chosenHour < endHour
            )
        })
    }

    const convertTo24Hour = time => {
        const [hourMin, period] = time
            .toLowerCase()
            .split(/(?<=\d)(?=[ap]m)/)
        let [hours, minutes] = hourMin.split(":")
        hours = parseInt(hours, 10)
        minutes = parseInt(minutes, 10) || 0

        if (period === "pm" && hours < 12) hours += 12
        if (period === "am" && hours === 12) hours = 0

        return `${hours
            .toString()
            .padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`
    }

    const handleTimePress = time => {
        if (isSlotBooked(time)) {
            Alert.alert(
                "Slot Already Booked",
                "This time slot is already booked."
            )
        } else {
            setSelectedTime(time)
        }
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
                        padding: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10
                    }}
                >
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="arrow-back-outline"
                        size={22}
                        color={theme.text}
                    />
                    <Text
                        style={{
                            fontSize: 15,
                            color: theme.text,
                            fontFamily: fontFamily.bold
                        }}
                    >
                        {route.params.place}
                    </Text>
                </View>

                <ScrollView
                    contentContainerStyle={{
                        //marginLeft: "auto",
                        marginLeft: 20
                    }}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                >
                    {route.params.sports.map(
                        (item, index) => {
                            return (
                                <View key={index}>
                                    {selectedSport.includes(
                                        item.name
                                    ) ? (
                                        <Pressable
                                            key={index}
                                            style={{
                                                borderColor:
                                                    "green",
                                                margin: 10,
                                                padding: 20,
                                                width: 80,
                                                height: 90,
                                                borderWidth: 3,
                                                borderRadius: 5,
                                                justifyContent:
                                                    "center",
                                                alignItems:
                                                    "center"
                                            }}
                                        >
                                            <MaterialCommunityIcons
                                                style={{
                                                    textAlign:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    alignItems:
                                                        "center"
                                                }}
                                                name={
                                                    item.icon
                                                }
                                                size={24}
                                                color={
                                                    theme.text
                                                }
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 10,
                                                    width: 80,
                                                    textTransform:
                                                        "uppercase",
                                                    textAlign:
                                                        "center",
                                                    marginTop: 10,
                                                    color: theme.text,
                                                    fontFamily:
                                                        fontFamily.medium
                                                }}
                                            >
                                                {item.name}
                                            </Text>
                                        </Pressable>
                                    ) : (
                                        <Pressable
                                            key={index}
                                            onPress={() => {
                                                setSelectedSport(
                                                    item.name
                                                )
                                                setSelectedCourt(
                                                    []
                                                )
                                            }}
                                            style={{
                                                borderColor:
                                                    "#686868",
                                                margin: 10,
                                                padding: 20,
                                                width: 80,
                                                height: 90,
                                                borderWidth: 1,
                                                borderRadius: 5,
                                                justifyContent:
                                                    "center",
                                                alignItems:
                                                    "center"
                                            }}
                                        >
                                            <MaterialCommunityIcons
                                                style={{
                                                    textAlign:
                                                        "center"
                                                }}
                                                name={
                                                    item.icon
                                                }
                                                size={24}
                                                color={
                                                    theme.text
                                                }
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 10,
                                                    color: theme.text,
                                                    fontFamily:
                                                        fontFamily.medium,
                                                    width: 80,
                                                    textTransform:
                                                        "uppercase",
                                                    textAlign:
                                                        "center",
                                                    marginTop: 10
                                                }}
                                            >
                                                {item.name}
                                            </Text>
                                        </Pressable>
                                    )}
                                </View>
                            )
                        }
                    )}
                </ScrollView>

                {selectedSport && (
                    <ScrollView>
                        <Calendar
                            selectedSport={selectedSport}
                            onSelectDate={setSelectedDate}
                            setSelectedTime={
                                setSelectedTime
                            }
                            selected={selectedDate}
                        />
                    </ScrollView>
                )}

                <Pressable
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 20,
                        width: "100%",
                        margin: 10
                    }}
                >
                    <Pressable
                        style={{
                            borderColor: "#E0E0E0",
                            borderWidth: 1,
                            paddingVertical: 15,
                            paddingHorizontal: 60,
                            borderRadius: 8,
                            flex: 1
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                textAlign: "center",
                                color: theme.text,
                                fontFamily: fontFamily.bold
                            }}
                        >
                            TIME
                        </Text>
                        <View>
                            <Text
                                style={{
                                    fontSize: 12,
                                    textAlign: "center",
                                    marginTop: 8,
                                    color: theme.text,
                                    fontFamily:
                                        fontFamily.regular
                                }}
                            >
                                {route?.params?.startTime
                                    ? route?.params
                                          ?.startTime
                                    : selectedTime.length >
                                      0
                                    ? selectedTime
                                    : "Choose Time"}
                            </Text>
                        </View>
                    </Pressable>
                    <Pressable
                        style={{
                            borderColor: "#E0E0E0",
                            borderWidth: 1,
                            paddingVertical: 15,
                            paddingHorizontal: 60,
                            borderRadius: 8,
                            flex: 1,
                            marginRight: 20
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.text,
                                fontFamily: fontFamily.bold,
                                textAlign: "center"
                            }}
                        >
                            TIME
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                textAlign: "center",
                                marginTop: 8,
                                color: theme.text,
                                fontFamily:
                                    fontFamily.regular
                            }}
                        >
                            {/* 06:30 AM */}
                            {route?.params?.endTime
                                ? route.params.endTime
                                : selectedTime.length > 0
                                ? calculateEndTime(
                                      selectedTime,
                                      duration
                                  )
                                : "Choose Time"}
                        </Text>
                    </Pressable>
                </Pressable>

                <Text
                    style={{
                        textAlign: "center",
                        fontSize: 16,
                        color: theme.text,
                        fontFamily: fontFamily.bold
                    }}
                >
                    Duration
                </Text>

                <Pressable
                    style={{
                        gap: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 10
                    }}
                >
                    <Pressable
                        onPress={() =>
                            setDuration(
                                Math.max(60, duration - 60)
                            )
                        }
                        style={{
                            width: 26,
                            height: 26,
                            borderRadius: 13,
                            borderColor: "gray",
                            borderWidth: 2,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                fontFamily:
                                    fontFamily.extraBold,
                                color: theme.text
                            }}
                        >
                            -
                        </Text>
                    </Pressable>
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 16,
                            fontFamily: fontFamily.bold,
                            color: theme.text
                        }}
                    >
                        {duration} min
                    </Text>
                    <Pressable
                        onPress={() =>
                            setDuration(duration + 60)
                        }
                        style={{
                            width: 26,
                            height: 26,
                            borderRadius: 14,
                            borderColor: "gray",
                            borderWidth: 2,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                fontFamily:
                                    fontFamily.extraBold,
                                color: theme.text
                            }}
                        >
                            +
                        </Text>
                    </Pressable>
                </Pressable>

                <Text
                    style={{
                        textAlign: "center",
                        marginVertical: 10,
                        fontSize: 16,
                        fontFamily: fontFamily.medium,
                        color: theme.text
                    }}
                >
                    Select Slot
                </Text>

                {selectedSport && (
                    <ScrollView
                        horizontal
                        contentContainerStyle={{
                            marginHorizontal: 10
                        }}
                        showsHorizontalScrollIndicator={
                            false
                        }
                    >
                        {checkedTimes?.map(
                            (item, index) => {
                                const disabled =
                                    isSlotBooked(item.time)
                                return (
                                    <View key={index}>
                                        {selectedTime.includes(
                                            item.time
                                        ) ? (
                                            <Pressable
                                                key={index}
                                                disabled={
                                                    item.status ===
                                                        false ||
                                                    disabled
                                                }
                                                onPress={() => {
                                                    setSelectedTime(
                                                        item.time
                                                    )
                                                }}
                                                style={{
                                                    margin: 10,
                                                    borderColor:
                                                        "#1CAC78",
                                                    backgroundColor:
                                                        "#29AB87",
                                                    borderRadius: 5,
                                                    borderWidth: 2,
                                                    padding: 10
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 15,
                                                        fontFamily:
                                                            fontFamily.bold,
                                                        color: theme.text
                                                    }}
                                                >
                                                    {
                                                        item.time
                                                    }
                                                </Text>
                                            </Pressable>
                                        ) : (
                                            <Pressable
                                                key={index}
                                                disabled={
                                                    item.status ===
                                                    false
                                                }
                                                onPress={() =>
                                                    handleTimePress(
                                                        item.time
                                                    )
                                                }
                                                // onPress={() => setSelectedTime(item.time)}
                                                style={{
                                                    margin: 10,
                                                    borderColor:
                                                        item.status ===
                                                            false ||
                                                        disabled
                                                            ? "gray"
                                                            : "#1CAC78",
                                                    borderRadius: 5,
                                                    borderWidth: 2,
                                                    padding: 10
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 15,
                                                        fontFamily:
                                                            fontFamily.bold,
                                                        color: theme.text
                                                    }}
                                                >
                                                    {
                                                        item.time
                                                    }
                                                </Text>
                                            </Pressable>
                                        )}
                                    </View>
                                )
                            }
                        )}
                    </ScrollView>
                )}

                <View style={{ marginHorizontal: 10 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            flexWrap: "wrap"
                        }}
                    >
                        {courts.map((item, index) =>
                            item.courts.map(court =>
                                selectedCourt.includes(
                                    court.name
                                ) ? (
                                    <Pressable
                                        key={court.id}
                                        onPress={() =>
                                            setSelectedCourt(
                                                court.name
                                            )
                                        }
                                        style={{
                                            backgroundColor:
                                                "#00A86B",
                                            borderRadius: 6,
                                            padding: 15,
                                            width: 180,
                                            margin: 10
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign:
                                                    "center",
                                                fontFamily:
                                                    fontFamily.regular,
                                                color: theme.text
                                            }}
                                        >
                                            {court.name}
                                        </Text>
                                    </Pressable>
                                ) : (
                                    <Pressable
                                        onPress={() =>
                                            setSelectedCourt(
                                                court.name
                                            )
                                        }
                                        style={{
                                            borderColor:
                                                "#00A86B",
                                            borderRadius: 6,
                                            padding: 15,
                                            borderWidth: 1,
                                            width: 180,
                                            margin: 10
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign:
                                                    "center",
                                                fontFamily:
                                                    fontFamily.italic,
                                                color: theme.text
                                            }}
                                        >
                                            {court.name}
                                        </Text>
                                    </Pressable>
                                )
                            )
                        )}
                    </View>
                </View>
                {selectedCourt.length > 0 && (
                    <Text
                        style={{
                            textAlign: "center",
                            marginTop: 10,
                            marginBottom: 20,
                            fontSize: 15,
                            fontFamily: fontFamily.bold,
                            color: theme.text
                        }}
                    >
                        Court Price : Kshs. {price}
                    </Text>
                )}
            </ScrollView>

            <Pressable
                onPress={() =>
                    payNavigation.navigate("Payment", {
                        selectedCourt: selectedCourt,
                        selectedSport: selectedSport,
                        price: price,
                        selectedTime: time,
                        selectedDate: selectedDate,
                        place: route.params.place,
                        gameId: route?.params?.gameId
                    })
                }
                style={{
                    backgroundColor: "#32CD32",
                    padding: 15,
                    marginBottom: 30,
                    borderRadius: 3,
                    marginHorizontal: 15
                }}
            >
                <Text
                    style={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold"
                    }}
                >
                    Next
                </Text>
            </Pressable>
        </SafeAreaView>
    )
}

export default SlotScreen

const styles = StyleSheet.create({})
