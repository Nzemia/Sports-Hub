import { AuthProvider } from "@/context/AuthContext"
import StackNavigator from "@/navigation/StackNavigator"

export default function Index() {
    return (
        <AuthProvider>
            <StackNavigator />
        </AuthProvider>
    )
}
