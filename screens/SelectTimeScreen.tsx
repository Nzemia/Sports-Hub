//@ts-nocheck    
import {
    Button,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, {
    useEffect,
    useLayoutEffect,
    useState
} from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "expo-router"
import { Feather, Ionicons } from "@expo/vector-icons"
import { RootStackParamList } from "@/configs/global"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import DateTimePickerModal from "react-native-modal-datetime-picker"

import { useTheme } from "@/constants/ThemeProvider"
import { fontFamily } from "@/constants/fonts"

type TimeNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Create"
>

const SelectTimeScreen = () => {
    const { theme } = useTheme()

    const navigation = useNavigation<TimeNavigationProp>()

    const [time, setTime] = useState("")
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)

    const [
        isStartTimePickerVisible,
        setStartTimePickerVisibility
    ] = useState(false)
    const [
        isEndTimePickerVisible,
        setEndTimePickerVisibility
    ] = useState(false)

    const times = [
        {
            id: "0",
            type: "Morning",
            timings: "12 am - 9 am",
            icon: (
                <Ionicons
                    name="partly-sunny-outline"
                    size={24}
                    color={theme.text}
                />
            )
        },
        {
            id: "1",
            type: "Day",
            timings: "9 am - 4 pm",
            icon: (
                <Feather
                    name="sun"
                    size={24}
                    color={theme.text}
                />
            )
        },
        {
            id: "2",
            type: "Evening",
            timings: "4pm - 9 pm",
            icon: (
                <Feather
                    name="sunset"
                    size={24}
                    color={theme.text}
                />
            )
        },
        {
            id: "3",
            type: "Night",
            timings: "9pm am - 11 pm",
            icon: (
                <Ionicons
                    name="cloudy-night-outline"
                    size={24}
                    color={theme.text}
                />
            )
        }
    ]
    const selectTime = item => {
        setTime(item)
        navigation.goBack()
    }
    useEffect(() => {
        console.log(startTime)
        console.log(endTime)
        if (startTime && endTime) {
            const formattedStartTime = formatTime(startTime)
            const formattedEndTime = formatTime(endTime)
            const timeInterval = `${formattedStartTime} - ${formattedEndTime}`
            navigation.goBack({ timeInterval })
        }
    }, [startTime, endTime, navigation])

    useLayoutEffect(() => {
        return navigation.setOptions({
            headerStyle: {
                backgroundColor: theme.background
            },
            headerTintColor: theme.text,
            headerShown: true,
            title: "Select Suitable Time",
            headerTitleStyle: {
                fontSize: 22,
                fontFamily: fontFamily.bold
            }
        })
    }, [])

    const showStartTimePicker = () => {
        setStartTimePickerVisibility(true)
    }

    const hideStartTimePicker = () => {
        setStartTimePickerVisibility(false)
    }

    const showEndTimePicker = () => {
        setEndTimePickerVisibility(true)
    }

    const hideEndTimePicker = () => {
        setEndTimePickerVisibility(false)
    }

    const handleConfirmStartTime = (time: any) => {
        setStartTime(time)
        hideStartTimePicker()
    }

    const handleConfirmEndTime = (time: any) => {
        setEndTime(time)
        hideEndTimePicker()

        if (startTime) {
            const formattedStartTime = formatTime(startTime)
            const formattedEndTime = formatTime(time)
            const timeInterval = `${formattedStartTime} - ${formattedEndTime}`

            
            navigation.navigate("Create", {
                timeInterval
            })
            navigation.goBack()
        }
    }

    const formatTime = (time: any) => {
        if (!time) return "Select Time"
        const hours = time.getHours()
        const minutes = time.getMinutes()
        const ampm = hours >= 12 ? "PM" : "AM"
        const formattedHours = hours % 12 || 12
        const formattedMinutes =
            minutes < 10 ? `0${minutes}` : minutes
        return `${formattedHours}:${formattedMinutes} ${ampm}`
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <Pressable
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}
            >
                {times.map((item, index) => (
                    <Pressable
                        onPress={() =>
                            selectTime(item.type)
                        }
                        key={index}
                        style={[
                            styles.iconContainer,
                            {
                                backgroundColor:
                                    theme.secondary
                            }
                        ]}
                    >
                        {item.icon}

                        <Text
                            style={[
                                styles.whenText,
                                { color: theme.text }
                            ]}
                        >
                            {item.type}
                        </Text>

                        <Text
                            style={[
                                styles.timingsText,
                                { color: theme.text }
                            ]}
                        >
                            {item.timings}
                        </Text>
                    </Pressable>
                ))}
            </Pressable>

            <View style={styles.container}>
                <View style={styles.timeContainer}>
                    <Text
                        style={[
                            styles.label,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        Start Time:
                    </Text>
                    <Button
                        title={formatTime(startTime)}
                        onPress={showStartTimePicker}
                    />
                    <DateTimePickerModal
                        isVisible={isStartTimePickerVisible}
                        mode="time"
                        onConfirm={handleConfirmStartTime}
                        onCancel={hideStartTimePicker}
                        is24Hour={false}
                    />
                </View>
                <View style={styles.timeContainer}>
                    <Text
                        style={[
                            styles.label,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        End Time:
                    </Text>
                    <Button
                        title={formatTime(endTime)}
                        onPress={showEndTimePicker}
                    />
                    <DateTimePickerModal
                        isVisible={isEndTimePickerVisible}
                        mode="time"
                        onConfirm={handleConfirmEndTime}
                        onCancel={hideEndTimePicker}
                        is24Hour={false}
                    />
                </View>
                {startTime && endTime && (
                    <View style={styles.summaryContainer}>
                        <Text
                            style={[
                                styles.summaryText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            Selected Interval:{" "}
                            {formatTime(startTime)} -{" "}
                            {formatTime(endTime)}
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

export default SelectTimeScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        padding: 16
    },
    timeContainer: {
        marginBottom: 16,
        alignItems: "center"
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontFamily: fontFamily.medium
    },
    summaryContainer: {
        marginTop: 32,
        alignItems: "center"
    },
    summaryText: {
        fontSize: 18,
        fontFamily: fontFamily.bold
    },
    whenText: {
        fontSize: 16,
        fontFamily: fontFamily.medium
    },
    timingsText: {
        fontSize: 13,
        fontFamily: fontFamily.italic
    },
    iconContainer: {
        margin: 20,
        width: 140,
        height: 120,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        gap: 15
    }
})
