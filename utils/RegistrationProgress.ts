import AsyncStorage from "@react-native-async-storage/async-storage"

type RegistrationData = {
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    image?: string
    otp?: string
}
export const saveRegistrationProgress = async (
    screenName: string,
    data: RegistrationData
) => {
    try {
        const key = `registration_progress_${screenName}`
        await AsyncStorage.setItem(
            key,
            JSON.stringify(data)
        )
        console.log(
            `Saved registration progress: ${screenName}`
        )
    } catch (error) {
        console.log(
            "Error saving registration progress",
            error
        )
        throw error
    }
}

export const getRegistrationProgress = async (
    screenName: string
) => {
    try {
        const key = `registration_progress_${screenName}`
        const data = await AsyncStorage.getItem(key)
        return data !== null ? JSON.parse(data) : null
    } catch (error) {
        console.log(
            "Error getting registration progress",
            error
        )
    }
}
