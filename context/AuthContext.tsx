import React, {
    createContext,
    useEffect,
    useState,
    ReactNode,
    useCallback
} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
    userId: string
    exp?: number
}

interface AuthContextType {
    token: string | null
    isLoading: boolean
    userId: string | null
    upcomingGames: any[]
    setToken: (token: string | null) => void
    setUserId: (userId: string | null) => void
    setUpcomingGames: React.Dispatch<
        React.SetStateAction<any[]>
    >
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    isLoading: false,
    userId: null,
    upcomingGames: [],
    setToken: () => {},
    setUserId: () => {},
    setUpcomingGames: () => {}
})

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
    children
}) => {
    const [token, setToken] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(
        null
    )
    const [isLoading, setIsLoading] =
        useState<boolean>(false)
    const [upcomingGames, setUpcomingGames] = useState<
        any[]
    >([])

    // Check if user is logged in
    const isLoggedIn = useCallback(async () => {
        setIsLoading(true)
        try {
            const storedToken = await AsyncStorage.getItem(
                "token"
            )
            if (storedToken) {
                setToken(storedToken)
            }
        } catch (error) {
            console.error("Error retrieving token:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Fetch and decode user info from token
    const fetchUser = useCallback(async () => {
        try {
            const storedToken = await AsyncStorage.getItem(
                "token"
            )
            if (storedToken) {
                const decodedToken: DecodedToken =
                    jwtDecode(storedToken)
                if (decodedToken?.userId) {
                    setUserId(decodedToken.userId)
                }
            }
        } catch (error) {
            console.error("Error decoding token:", error)
        }
    }, [])

    useEffect(() => {
        isLoggedIn()
    }, [])

    useEffect(() => {
        if (token) fetchUser()
    }, [token, fetchUser])

    return (
        <AuthContext.Provider
            value={{
                token,
                isLoading,
                userId,
                setToken,
                setUserId,
                upcomingGames,
                setUpcomingGames
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
