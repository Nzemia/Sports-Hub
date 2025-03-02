import { saveRegistrationProgress } from "@/utils/RegistrationProgress"
import { useState } from "react"
import { Alert } from "react-native"

type ScreenName =
    | "Name"
    | "Email"
    | "Password"
    | "Image"
    | "Otp"
    | "PreFinal"

const useRegistration = (screenName: ScreenName) => {
    const [error, setError] = useState<string | null>(null)

    const validateAndSave = async (data: any) => {
        try {           
            switch (screenName) {
                case "Name":
                    if (!data.firstName) {
                        throw new Error(
                            "First name is required."
                        )
                    }
                    break

                case "Email":
                    if (
                        !data.email ||
                        !data.email.includes("@") ||
                        !data.email.includes(".")
                    ) {
                        throw new Error(
                            "Please enter a valid email address."
                        )
                    }
                    break

                case "Password":
                    if (
                        !data.password ||
                        data.password.length < 6
                    ) {
                        throw new Error(
                            "Password must be at least 6 characters long."
                        )
                    }
                    break
                
                case "Otp":
                    if (!data.otp) {
                        throw new Error(
                            "Please enter your OTP."
                        )
                    }
                    break

                case "Image":
                    if (!data.image) {
                        throw new Error(
                            "Please select an image or enter your image url link."
                        )
                    }
                    break

                default:
                    throw new Error("Invalid screen name.")
            }

            await saveRegistrationProgress(screenName, data)
            setError(null)
            return true
        } catch (error: any) {
            setError(error.message)
            Alert.alert("Error", error.message)
            return false
        }
    }

    return { validateAndSave, error }
}

export default useRegistration
