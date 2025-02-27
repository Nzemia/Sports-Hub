import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react"
import {
    ColorSchemeName,
    useColorScheme,
    Appearance,
    AppState,
    AppStateStatus
} from "react-native"

type ThemeType = {
    background: string
    text: string
    primary: string
    secondary: string
    activeTabColor: string
    inactiveTabColor: string
    statusBarStyle: "auto" | "light" | "dark" | "inverted"
}

const lightTheme: ThemeType = {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#1E1E1E",
    secondary: "#FFFFFF",
    activeTabColor: "#1E1E1E",
    inactiveTabColor: "#9DB2CE",
    statusBarStyle: "dark"
}

const darkTheme: ThemeType = {
    background: "#121212",
    text: "#FFFFFF",
    primary: "#FFFFFF",
    secondary: "#1E1E1E",
    activeTabColor: "#FFFFFF",
    inactiveTabColor: "#9DB2CE",
    statusBarStyle: "light"
}

const ThemeContext = createContext<{
    theme: ThemeType
    toggleTheme: () => void
    isDarkMode: boolean
}>({
    theme: lightTheme,
    toggleTheme: () => {},
    isDarkMode: false
})

export function ThemeProvider({
    children
}: {
    children: React.ReactNode
}) {
    const systemTheme: ColorSchemeName = useColorScheme()
    const [isDarkMode, setIsDarkMode] = useState(
        systemTheme === "dark"
    )
    const [theme, setTheme] = useState<ThemeType>(
        isDarkMode ? darkTheme : lightTheme
    )

    // Handle app state changes
    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            (nextAppState: AppStateStatus) => {
                if (nextAppState === "active") {
                    const colorScheme =
                        Appearance.getColorScheme()
                    setIsDarkMode(colorScheme === "dark")
                    setTheme(
                        colorScheme === "dark"
                            ? darkTheme
                            : lightTheme
                    )
                }
            }
        )

        // Handle system theme changes
        const appearanceListener =
            Appearance.addChangeListener(
                ({ colorScheme }) => {
                    setIsDarkMode(colorScheme === "dark")
                    setTheme(
                        colorScheme === "dark"
                            ? darkTheme
                            : lightTheme
                    )
                }
            )

        return () => {
            subscription.remove()
            appearanceListener.remove()
        }
    }, [])

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev)
        setTheme(current =>
            current === lightTheme ? darkTheme : lightTheme
        )
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                isDarkMode
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}
