import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from "react-native"
import React from "react"
import moment, { Moment } from "moment"
import { useTheme } from "@/constants/ThemeProvider"
import { fontFamily } from "@/constants/fonts"

interface DateProps {
    date: Moment
    setSelectedTime: (time: string) => void
    onSelectDate: (date: string) => void
    selected: string
}

const Date: React.FC<DateProps> = ({
    date,
    setSelectedTime,
    onSelectDate,
    selected
}) => {
    const { theme } = useTheme()

    const day =
        moment(date).format("YYYY-MM-DD") ===
        moment().format("YYYY-MM-DD")
            ? "Today"
            : moment(date).format("ddd")
    // get the day number e.g 1, 2, 3, 4, 5, 6, 7
    const dayNumber = moment(date).format("D")

    // get the full date e.g 2021-01-01 - we'll use this to compare the date to the selected date
    const fullDate = moment(date).format("YYYY-MM-DD")
    //console.log(fullDate)
    return (
        <TouchableOpacity
            onPress={() => {
                setSelectedTime("")
                onSelectDate(fullDate)
            }}
            style={[
                styles.card,
                selected === fullDate && {
                    backgroundColor: "#07bc0c"
                }
            ]}
        >
            <Text
                style={[
                    styles.big,
                    selected === fullDate && {
                        color: theme.text,
                        fontFamily: fontFamily.bold
                    }
                ]}
            >
                {day}
            </Text>
            <View style={{ height: 10 }} />
            <Text
                style={[
                    styles.medium,
                    selected === fullDate && {
                        color: theme.text,
                        fontFamily: fontFamily.bold,
                        fontSize: 24
                    }
                ]}
            >
                {dayNumber}
            </Text>
        </TouchableOpacity>
    )
}

export default Date

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#9DB2CE",
        borderRadius: 10,
        borderColor: "#ddd",
        padding: 10,
        marginVertical: 10,
        alignItems: "center",
        height: 90,
        width: 80,
        marginHorizontal: 5
    },
    big: {
        fontSize: 20
    },
    medium: {
        fontSize: 24,
        fontWeight: "bold"
    }
})
