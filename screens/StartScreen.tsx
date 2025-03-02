import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useRef } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import MapView, {
    MapViewProps,
    Marker
} from "react-native-maps"
import { useLocation } from "@/utils/useLocation"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "@/configs/global"

import { fontFamily } from "@/constants/fonts"
import CustomButton from "@/components/Button"
import { useNavigation } from "expo-router"

type NameNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Name"
>

const StartScreen = () => {
    const { theme } = useTheme()

    const navigation = useNavigation<NameNavigationProp>()

    const {
        errorMsg,
        location,
        markerPosition,
        handleMarkerDragEnd
    } = useLocation()

    if (errorMsg) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Text>{errorMsg}</Text>
            </View>
        )
    }
    if (!location) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <ActivityIndicator
                    size="large"
                    color="blue"
                />
            </View>
        )
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            {/** map */}
            <MapView
                style={{
                    width: "100%",
                    height: 500,
                    marginTop: 20,
                    borderRadius: 10
                }}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
            >
                <Marker
                    draggable={true}
                    onDragEnd={handleMarkerDragEnd}
                    coordinate={markerPosition}
                >
                    {/* Custom Marker Pin */}
                    <Image
                        source={require("../assets/images/map_icon_pin.png")}
                        style={{
                            width: 25,
                            height: 25
                        }}
                    />
                </Marker>
            </MapView>

            <View
                style={{
                    marginTop: 35,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Text
                    style={[
                        styles.neighborhoodText,
                        { color: theme.text }
                    ]}
                >
                    Find Players in Your Neighborhood
                </Text>

                <Text
                    style={[
                        styles.justLikeYouText,
                        { color: theme.text }
                    ]}
                >
                    Just like you did as a Kid!
                </Text>
            </View>

            {/** register */}
            <View style={{ paddingHorizontal: 15 }}>
                <CustomButton
                    title={"Register"}
                    style={{
                        marginTop: 20,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "green"
                    }}
                    onPress={() =>
                        navigation.navigate("Name")
                    }
                />
            </View>

            {/** login */}
            <View
                style={{
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row"
                }}
            >
                <Text
                    style={[
                        styles.alreadyHaveAccountText,
                        { color: theme.text }
                    ]}
                >
                    Already have an account?{" "}
                </Text>
                <Pressable
                    onPress={() =>
                        navigation.navigate("Login")
                    }
                >
                    <Text
                        style={[
                            styles.loginText,
                            { color: theme.text }
                        ]}
                    >
                        Login
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default StartScreen

const styles = StyleSheet.create({
    neighborhoodText: {
        fontSize: 22,
        fontFamily: fontFamily.extraBold,
        marginTop: 20,
        width: "50%",
        textAlign: "center"
    },
    justLikeYouText: {
        fontSize: 16,
        fontFamily: fontFamily.italic,
        marginTop: 10,
        textAlign: "center"
    },
    alreadyHaveAccountText: {
        fontSize: 15,
        fontFamily: fontFamily.medium
    },
    loginText: {
        fontSize: 15,
        fontFamily: fontFamily.extraBold,
        textDecorationLine: "underline"
    }
})
