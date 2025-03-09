import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import moment, { Moment } from "moment"
import Date from "./Date"
import { fontFamily } from "@/constants/fonts"

interface CalendarProps {
    selectedSport: string
    onSelectDate: (date: string) => void
    setSelectedTime: (time: string) => void
    selected: string
}

const Calendar: React.FC<CalendarProps> = ({
    selectedSport,
    onSelectDate,
    setSelectedTime,
    selected
}) => {
    const { theme } = useTheme()
    const [dates, setDates] = useState<Moment[]>([])
    const [scrollPosition, setScrollPosition] =
        useState<number>(0)
    const [currentMonth, setCurrentMonth] =
        useState<string>("")

    const getCurrentMonth = () => {
        const month = moment(dates[0])
            .add(scrollPosition / 60, "days")
            .format("MMMM")
        setCurrentMonth(month)
    }

    const getDates = () => {
        const _dates: Moment[] = []
        for (let i = 0; i < 10; i++) {
            const date = moment().add(i, "days")
            _dates.push(date)
        }
        setDates(_dates)
    }

    useEffect(() => {
        getDates()
    }, [])

    useEffect(() => {
        getCurrentMonth()
    }, [scrollPosition])

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <View style={styles.centered}>
                <Text
                    style={[
                        styles.title,
                        {
                            color: theme.text,
                            fontFamily: fontFamily.bold,
                            fontSize: 24
                        }
                    ]}
                >
                    {currentMonth}
                </Text>
                <Text
                    style={[
                        styles.title,
                        {
                            color: theme.text,
                            fontFamily: fontFamily.medium,
                            fontSize: 16
                        }
                    ]}
                >
                    {selectedSport}
                </Text>
            </View>
            <View
                style={[
                    styles.dateSection,
                    {
                        backgroundColor: theme.background
                    }
                ]}
            >
                <View style={styles.scroll}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={
                            false
                        }
                        scrollEventThrottle={16}
                        onScroll={e =>
                            setScrollPosition(
                                e.nativeEvent.contentOffset
                                    .x
                            )
                        }
                    >
                        {dates.map((date, index) => (
                            <Date
                                key={index}
                                date={date}
                                setSelectedTime={
                                    setSelectedTime
                                }
                                onSelectDate={onSelectDate}
                                selected={selected}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Calendar

const styles = StyleSheet.create({
    centered: {
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 18,
        marginTop: 6
    },
    dateSection: {
        width: "100%",
        padding: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    scroll: {}
})
