import React, {
    createContext,
    useEffect,
    useState,
    ReactNode
} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface AuthContextProps {
    token: string | null
    isLoading: boolean
    login: () => void
    register: () => void
    setToken: React.Dispatch<
        React.SetStateAction<string | null>
    >
}

export const AuthContext = createContext<AuthContextProps>({
    token: null,
    isLoading: false,
    login: () => {},
    register: () => {},
    setToken: () => {}
})

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({
    children
}: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] =
        useState<boolean>(false)

    const login = async () => {
        const fakeToken = "token"
        await AsyncStorage.setItem("token", fakeToken)
        setToken(fakeToken)
        setIsLoading(false)
    }

    const register = async () => {
        const fakeToken = ""
        await AsyncStorage.setItem("token", fakeToken)
        setToken(fakeToken)
        setIsLoading(false)
    }

    const isLoggedIn = async () => {
        try {
            setIsLoading(true)
            const userToken = await AsyncStorage.getItem(
                "token"
            )
            setToken(userToken)
            setIsLoading(false)
        } catch (error) {
            console.log(
                "Error checking login status",
                error
            )
            setIsLoading(false)
        }
    }

    useEffect(() => {
        isLoggedIn()
    }, [])

    useEffect(() => {
        if (token) {
            // trigger any navigation or side effects when token is set.
            // console.log(
            //     "Token set, performing navigation..."
            // )
        }
    }, [token])

    return (
        <AuthContext.Provider
            value={{
                token,
                isLoading,
                login,
                register,
                setToken
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
