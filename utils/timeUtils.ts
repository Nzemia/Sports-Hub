import moment from "moment"

export const calculateEndTime = (
    startTime: string,
    duration: number
): string => {
    if (typeof startTime !== "string") {
        console.error("Invalid startTime:", startTime)
        return ""
    }

    const match = startTime.match(/(\d+:\d+)([APMapm]+)/)
    if (!match) {
        console.error(
            "Invalid startTime format:",
            startTime
        )
        return ""
    }

    const time = match[1]
    const modifier = match[2].toUpperCase()

    let [hours, minutes] = time
        .split(":")
        .map(num => parseInt(num, 10))

    if (modifier === "PM" && hours < 12) hours += 12
    if (modifier === "AM" && hours === 12) hours = 0

    const totalMinutes = hours * 60 + minutes + duration
    let endHours = Math.floor(totalMinutes / 60)
    let endMinutes = totalMinutes % 60

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

    return `${endHours
        .toString()
        .padStart(2, "0")}:${endMinutes
        .toString()
        .padStart(2, "0")} ${endModifier}`
}

export const generateTimeSlots = (
    selectedDate: string
): string[] => {
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

    return result
}
