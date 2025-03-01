import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { useTheme } from "@/constants/ThemeProvider"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeScreen from "@/screens/HomeScreen"
import Ionicons from "@expo/vector-icons/Ionicons"
import AntDesign from "@expo/vector-icons/AntDesign"
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons"

import PlayScreen from "@/screens/PlayScreen"
import BookScreen from "@/screens/BookScreen"
import ProfileScreen from "@/screens/ProfileScreen"
import VenueInfoScreen from "@/screens/VenueInfoScreen"
import StartScreen from "@/screens/StartScreen"
import LoginScreen from "@/screens/LoginScreen"
import RegisterScreen from "@/screens/RegisterScreen"
import PasswordScreen from "@/screens/PasswordScreen"
import NameScreen from "@/screens/NameScreen"
import SelectImage from "@/screens/SelectImage"
import PreFinalScreen from "@/screens/PreFinalScreen"
import OtpScreen from "@/screens/OtpScreen"

const StackNavigator = () => {
    const { theme } = useTheme()
    const Stack = createNativeStackNavigator()

    const Tab = createBottomTabNavigator()

    function BottomTabs() {
        return (
            <Tab.Navigator
                screenOptions={{
                    //headerShown: false,
                    tabBarStyle: {
                        backgroundColor: theme.background
                    },
                    tabBarActiveTintColor:
                        theme.activeTabColor,
                    tabBarInactiveTintColor:
                        theme.inactiveTabColor,
                    tabBarShowLabel: false
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        headerShown: true,
                        tabBarIcon: ({
                            focused,
                            color,
                            size
                        }) =>
                            focused ? (
                                <Ionicons
                                    name={"home-sharp"}
                                    color={color}
                                    size={size}
                                />
                            ) : (
                                <Ionicons
                                    name={"home-outline"}
                                    color={color}
                                    size={size}
                                />
                            )
                    }}
                />
                <Tab.Screen
                    name="Play"
                    component={PlayScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <AntDesign
                                name={"addusergroup"}
                                color={color}
                                size={size}
                            />
                        )
                    }}
                />
                <Tab.Screen
                    name="Book"
                    component={BookScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <SimpleLineIcons
                                name={"book-open"}
                                color={color}
                                size={size}
                            />
                        )
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({
                            focused,
                            color,
                            size
                        }) =>
                            focused ? (
                                <Ionicons
                                    name={"person"}
                                    color={color}
                                    size={size}
                                />
                            ) : (
                                <Ionicons
                                    name={"person-outline"}
                                    color={color}
                                    size={size}
                                />
                            )
                    }}
                />
            </Tab.Navigator>
        )
    }

    const AuthStack = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Start"
                    component={StartScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Password"
                    component={PasswordScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Otp"
                    component={OtpScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Name"
                    component={NameScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Image"
                    component={SelectImage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PreFinal"
                    component={PreFinalScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        )
    }

    function MainStack() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Main"
                    component={BottomTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Venue"
                    component={VenueInfoScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        )
    }
    return <MainStack />
}

export default StackNavigator

const styles = StyleSheet.create({})
