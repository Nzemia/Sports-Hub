import { useTheme } from "@/constants/ThemeProvider"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import React from "react"
import {
    TouchableOpacity,
    StyleProp,
    ViewStyle
} from "react-native"

interface GoNextButtonProps {
    onPress: () => void
    style?: StyleProp<ViewStyle>
}

const GoNextButton: React.FC<GoNextButtonProps> = ({
    onPress,
    style
}) => {
    const { theme } = useTheme()

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                {
                    marginTop: 30,
                    marginLeft: "auto"
                },
                style
            ]}
            onPress={onPress}
        >
            <MaterialCommunityIcons
                style={{ color: theme.text }}
                size={26}
                name="arrow-right-bold-circle"
            />
        </TouchableOpacity>
    )
}

export default GoNextButton
