import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    Pressable,
    Alert,
    TextInput
} from "react-native"
import React, {
    useContext,
    useEffect,
    useState
} from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import {
    AntDesign,
    Entypo,
    Feather,
    FontAwesome,
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons
} from "@expo/vector-icons"
import { useNavigation } from "expo-router"
import { fontFamily } from "@/constants/fonts"
import CustomTextInput from "@/components/TextInput"
import CustomButton from "@/components/Button"
import { AuthContext } from "@/context/AuthContext"
import moment from "moment"
import axios from "axios"
import DatePickerModal from "@/components/Modal"
import {
    RouteProp,
    useRoute
} from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "@/configs/global"

type Venue = {
    id: string
    name: string
    image: string
    near: string
    rating: number
}

type CreateActivityNavigationProp =
    NativeStackNavigationProp<RootStackParamList, "Time">

type goBackActivityNavigationProp =
    NativeStackNavigationProp<RootStackParamList, "Play">

const CreateActivity = () => {
    const { theme } = useTheme()
    const navigation =
        useNavigation<CreateActivityNavigationProp>()

    const navigation2 =
        useNavigation<goBackActivityNavigationProp>()

    const route =
        useRoute<RouteProp<RootStackParamList, "Create">>()

    const [sport, setSport] = useState("")
    const [area, setArea] = useState("")
    const [taggedVenue, setTaggedVenue] =
        useState<Venue | null>(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [date, setDate] = useState("")
    const [noOfPlayers, setNoOfPlayers] = useState("")
    const [timeInterval, setTimeInterval] = useState("")
    const [selected, setSelected] = useState("Public")
    const [
        additionalInstructions,
        setAdditionalInstructions
    ] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { userId } = useContext(AuthContext)

    const createGame = async () => {
        setIsLoading(true)
        try {
            const admin = userId
            const time = timeInterval
            const gameData = {
                sport,
                area: taggedVenue,
                date,
                time,
                admin,
                totalPlayers: noOfPlayers
            }

            const response = await axios.post(
                "http://10.16.14.162:3000/api/games/createGame",
                gameData
            )

            if (response.status === 200) {
                console.log("Game created Successfully")
                setSport("")
                setArea("")
                setDate("")
                setTimeInterval("")

                navigation2.replace("Play")
            }
        } catch (error) {
            console.error("Failed to create game:", error)
            setIsLoading(false)
            setTimeout(() => {
                Alert.alert(
                    "Error!",
                    "Failed to create game",
                    [
                        {
                            text: "Cancel",
                            onPress: () =>
                                console.log(
                                    "Cancel Pressed"
                                ),
                            style: "cancel"
                        },
                        {
                            text: "OK",
                            onPress: () =>
                                navigation.goBack()
                        }
                    ]
                )
            }, 100)
        } finally {
            setIsLoading(false)
        }
    }

    //generate dates
    const generateDates = () => {
        const dates = []
        for (let i = 0; i < 10; i++) {
            const date = moment().add(i, "days")
            let displayDate
            if (i === 0) {
                displayDate = "Today"
            } else if (i === 1) {
                displayDate = "Tomorrow"
            } else if (i === 2) {
                displayDate = "Day after"
            } else {
                displayDate = date.format("Do MMMM")
            }
            dates.push({
                id: i.toString(),
                displayDate,
                dayOfWeek: date.format("dddd"),
                actualDate: date.format("Do MMMM")
            })
        }
        return dates
    }
    const dates = generateDates()
    //console.log("Dates", dates)
    const selectDate = (date: string | Date) => {
        setModalVisible(false)
        setDate(
            typeof date === "string"
                ? date
                : date.toISOString()
        )
    }

    useEffect(() => {
        if (route.params?.taggedVenue !== undefined) {
            setTaggedVenue(route.params.taggedVenue)
        }
        if (route.params?.timeInterval !== undefined) {
            setTimeInterval(route.params.timeInterval || "")
        }
    }, [route.params])

    // useEffect(() => {
    //     if (route?.params?.taggedVenue) {
    //         setTaggedVenue(route?.params?.taggedVenue)
    //     }
    // }, [route?.params])

    // useEffect(() => {
    //     if (route?.params?.timeInterval) {
    //         setTimeInterval(route.params.timeInterval)
    //     }
    // }, [route?.params])

    return (
        <>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: theme.background
                }}
            >
                <ScrollView>
                    <View style={{ marginHorizontal: 10 }}>
                        <Ionicons
                            onPress={() =>
                                navigation.goBack()
                            }
                            name="arrow-back"
                            size={24}
                            color={theme.text}
                        />
                    </View>

                    <View style={{ padding: 20 }}>
                        <Text
                            style={[
                                styles.createActivityText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            Create Activity
                        </Text>

                        {/** sport */}
                        <Pressable
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 20,
                                marginTop: 15,
                                marginVertical: 10
                            }}
                        >
                            <MaterialCommunityIcons
                                name="whistle"
                                size={24}
                                color={theme.text}
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.sportsText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Sport
                                </Text>
                                <CustomTextInput
                                    value={sport}
                                    onChangeText={setSport}
                                    style={{
                                        marginTop: 7,
                                        fontSize: 15
                                    }}
                                    placeholderTextColor="gray"
                                    placeholder={
                                        "Eg Badminton / Football / Cricket"
                                    }
                                />
                            </View>
                        </Pressable>

                        <Text
                            style={{
                                borderColor: "#E0E0E0",
                                borderWidth: 0.7,
                                height: 1
                            }}
                        />

                        {/** area */}
                        <Pressable
                            onPress={() =>
                                navigation.navigate(
                                    "TagVenue"
                                )
                            }
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 20,
                                marginTop: 15,
                                marginVertical: 10
                            }}
                        >
                            <Entypo
                                name="location"
                                size={24}
                                color={theme.text}
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.sportsText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Area
                                </Text>
                                <CustomTextInput
                                    value={
                                        area ||
                                        (taggedVenue
                                            ? taggedVenue.name
                                            : "")
                                    }
                                    onChangeText={setArea}
                                    style={{
                                        marginTop: 7,
                                        fontSize: 15
                                    }}
                                    placeholderTextColor="gray"
                                    placeholder={
                                        "Locality or venue name"
                                    }
                                    editable={false}
                                />
                            </View>
                        </Pressable>

                        <Text
                            style={{
                                borderColor: "#E0E0E0",
                                borderWidth: 0.7,
                                height: 1
                            }}
                        />

                        {/** date */}
                        <Pressable
                            onPress={() =>
                                setModalVisible(
                                    !modalVisible
                                )
                            }
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 20,
                                marginTop: 15,
                                marginVertical: 10
                            }}
                        >
                            <Feather
                                name="calendar"
                                size={24}
                                color={theme.text}
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.sportsText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Date
                                </Text>
                                <TextInput
                                    editable={false}
                                    //value={date}
                                    style={{
                                        marginTop: 7,
                                        fontSize: 15,
                                        backgroundColor:
                                            theme.background,
                                        borderColor:
                                            theme.text,
                                        borderWidth: 2,
                                        borderRadius: 5,
                                        paddingHorizontal: 10
                                    }}
                                    placeholderTextColor={
                                        date
                                            ? theme.text
                                            : "gray"
                                    }
                                    placeholder={
                                        date
                                            ? date
                                            : "Pick a Day"
                                    }
                                />
                            </View>
                        </Pressable>

                        <Text
                            style={{
                                borderColor: "#E0E0E0",
                                borderWidth: 0.7,
                                height: 1
                            }}
                        />

                        {/** time */}
                        <Pressable
                            onPress={() =>
                                navigation.navigate("Time")
                            }
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 20,
                                marginTop: 15,
                                marginVertical: 10
                            }}
                        >
                            <AntDesign
                                name="clockcircleo"
                                size={24}
                                color={theme.text}
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.sportsText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Time
                                </Text>
                                <TextInput
                                    value={
                                        timeInterval || ""
                                    }
                                    style={{
                                        marginTop: 7,
                                        fontSize: 15,
                                        backgroundColor:
                                            theme.background,
                                        borderColor:
                                            theme.text,
                                        borderWidth: 2,
                                        borderRadius: 5,
                                        paddingHorizontal: 10
                                    }}
                                    placeholderTextColor={
                                        timeInterval
                                            ? theme.text
                                            : "gray"
                                    }
                                    placeholder={
                                        timeInterval
                                            ? timeInterval
                                            : "Pick Exact Time"
                                    }
                                    editable={false}
                                />
                            </View>
                        </Pressable>

                        <Text
                            style={{
                                borderColor: "#E0E0E0",
                                borderWidth: 0.7,
                                height: 1
                            }}
                        />

                        {/** public or invite only */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 20,
                                marginTop: 7,
                                marginVertical: 10
                            }}
                        >
                            <Feather
                                name="activity"
                                size={24}
                                color={theme.text}
                            />

                            <View>
                                <Text
                                    style={[
                                        styles.activitiesAccessText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Activity Access
                                </Text>

                                <Pressable
                                    style={{
                                        flexDirection:
                                            "row",
                                        alignItems: "center"
                                    }}
                                >
                                    <Pressable
                                        onPress={() =>
                                            setSelected(
                                                "Public"
                                            )
                                        }
                                        style={
                                            selected.includes(
                                                "Public"
                                            )
                                                ? {
                                                      flexDirection:
                                                          "row",
                                                      alignItems:
                                                          "center",
                                                      gap: 8,
                                                      backgroundColor:
                                                          "#07bc0c",
                                                      width: 140,
                                                      justifyContent:
                                                          "center",
                                                      borderRadius: 3,
                                                      padding: 10
                                                  }
                                                : {
                                                      flexDirection:
                                                          "row",
                                                      alignItems:
                                                          "center",
                                                      gap: 8,
                                                      backgroundColor:
                                                          "white",
                                                      width: 140,
                                                      justifyContent:
                                                          "center",
                                                      borderRadius: 3,
                                                      padding: 10
                                                  }
                                        }
                                    >
                                        <Ionicons
                                            name="earth"
                                            size={24}
                                            color={
                                                selected.includes(
                                                    "Public"
                                                )
                                                    ? "white"
                                                    : "black"
                                            }
                                        />
                                        <Text
                                            style={
                                                selected.includes(
                                                    "Public"
                                                )
                                                    ? {
                                                          color: "white",
                                                          fontFamily:
                                                              fontFamily.bold,
                                                          fontSize: 15
                                                      }
                                                    : {
                                                          color: "black",
                                                          fontFamily:
                                                              fontFamily.bold,
                                                          fontSize: 15
                                                      }
                                            }
                                        >
                                            Public
                                        </Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() =>
                                            setSelected(
                                                "invite only"
                                            )
                                        }
                                        style={
                                            selected.includes(
                                                "invite only"
                                            )
                                                ? {
                                                      flexDirection:
                                                          "row",
                                                      alignItems:
                                                          "center",
                                                      gap: 8,
                                                      backgroundColor:
                                                          "#07bc0c",
                                                      width: 140,
                                                      justifyContent:
                                                          "center",
                                                      borderRadius: 3,
                                                      padding: 10
                                                  }
                                                : {
                                                      flexDirection:
                                                          "row",
                                                      alignItems:
                                                          "center",
                                                      gap: 8,
                                                      backgroundColor:
                                                          "white",
                                                      width: 140,
                                                      justifyContent:
                                                          "center",
                                                      borderRadius: 3,
                                                      padding: 10
                                                  }
                                        }
                                    >
                                        <AntDesign
                                            name="lock1"
                                            size={24}
                                            color={
                                                selected.includes(
                                                    "invite only"
                                                )
                                                    ? "white"
                                                    : "black"
                                            }
                                        />
                                        <Text
                                            style={
                                                selected.includes(
                                                    "invite only"
                                                )
                                                    ? {
                                                          color: "white",
                                                          fontFamily:
                                                              fontFamily.bold,
                                                          fontSize: 15
                                                      }
                                                    : {
                                                          color: "black",
                                                          fontFamily:
                                                              fontFamily.bold,
                                                          fontSize: 15
                                                      }
                                            }
                                        >
                                            Invite Only
                                        </Text>
                                    </Pressable>
                                </Pressable>
                            </View>
                        </View>
                        <Text
                            style={{
                                borderColor: "#E0E0E0",
                                borderWidth: 0.7,
                                height: 1,
                                marginTop: 7
                            }}
                        />

                        {/** total players */}
                        <Text
                            style={[
                                styles.totalPlayersText,
                                { color: theme.text }
                            ]}
                        >
                            Total Players
                        </Text>
                        <View
                            style={[
                                styles.totalPlayersContainer,
                                {
                                    backgroundColor:
                                        theme.secondary
                                }
                            ]}
                        >
                            <View
                                style={{
                                    marginVertical: 5
                                }}
                            >
                                <CustomTextInput
                                    value={noOfPlayers}
                                    onChangeText={
                                        setNoOfPlayers
                                    }
                                    style={{
                                        padding: 10,
                                        borderColor:
                                            "#D0D0D0",
                                        borderWidth: 1
                                    }}
                                    placeholder="Total Players (including you)"
                                    placeholderTextColor={
                                        theme.text
                                    }
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>

                        <Text
                            style={{
                                borderColor: "#E0E0E0",
                                borderWidth: 0.7,
                                height: 1,
                                marginTop: 12
                            }}
                        />

                        {/** add instructions */}
                        <Text
                            style={[
                                styles.totalPlayersText,
                                { color: theme.text }
                            ]}
                        >
                            Add Instructions
                        </Text>

                        <View
                            style={[
                                styles.addInstructionsContainer,
                                {
                                    backgroundColor:
                                        theme.secondary
                                }
                            ]}
                        >
                            <View
                                style={{
                                    marginVertical: 5,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8
                                }}
                            >
                                <Ionicons
                                    name="bag-check"
                                    size={24}
                                    color="red"
                                />

                                <Text
                                    style={[
                                        styles.sportsText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Bring your own equipment
                                </Text>

                                <FontAwesome
                                    name="check-square"
                                    size={24}
                                    color="green"
                                />
                            </View>

                            <View
                                style={{
                                    marginVertical: 5,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="directions-fork"
                                    size={24}
                                    color="#FEBE10"
                                />

                                <Text
                                    style={[
                                        styles.sportsText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Cost Shared
                                </Text>

                                <FontAwesome
                                    name="check-square"
                                    size={24}
                                    color="green"
                                />
                            </View>

                            <View
                                style={{
                                    marginVertical: 5,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8
                                }}
                            >
                                <FontAwesome5
                                    name="syringe"
                                    size={24}
                                    color="green"
                                />

                                <Text
                                    style={[
                                        styles.sportsText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Covid Vaccinated players
                                    preferred
                                </Text>

                                <FontAwesome
                                    name="check-square"
                                    size={24}
                                    color="green"
                                />
                            </View>

                            <CustomTextInput
                                value={
                                    additionalInstructions
                                }
                                onChangeText={
                                    setAdditionalInstructions
                                }
                                style={{
                                    padding: 10,
                                    //backgroundColor: "white",
                                    borderColor: "#D0D0D0",
                                    borderWidth: 2,
                                    marginVertical: 8,
                                    borderRadius: 6
                                }}
                                placeholder="Add Additional Instructions"
                                placeholderTextColor={
                                    theme.text
                                }
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 20,
                                marginTop: 15,
                                marginVertical: 10
                            }}
                        >
                            <AntDesign
                                name="setting"
                                size={24}
                                color={theme.text}
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.createActivityText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    Advanced Settings
                                </Text>
                            </View>
                            <AntDesign
                                name="arrowright"
                                size={24}
                                color={theme.text}
                            />
                        </View>
                    </View>

                    <View style={{ paddingHorizontal: 10 }}>
                        <CustomButton
                            title={"Create Activity"}
                            onPress={createGame}
                            style={{
                                backgroundColor: "#07bc0c",
                                marginTop: "auto",
                                marginBottom: 30,
                                padding: 12,
                                borderRadius: 4,
                                width: "100%"
                            }}
                            loading={isLoading}
                        />
                    </View>

                    <DatePickerModal
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        dates={dates}
                        selectDate={selectDate}
                    />
                </ScrollView>
            </SafeAreaView>

            {/* <Modal
                onBackdropPress={() =>
                    setModalVisible(!modalVisible)
                }
                swipeDirection={["up", "down"]}
                swipeThreshold={200}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom"
                    })
                }
                onHardwareBackPress={() =>
                    setModalVisible(!modalVisible)
                }
                visible={modalVisible}
                onTouchOutside={() =>
                    setModalVisible(!modalVisible)
                }
            >
                <ModalContent
                    style={{
                        width: "100%",
                        height: 400,
                        backgroundColor: "white"
                    }}
                >
                    <View>
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 16,
                                fontWeight: "bold"
                            }}
                        >
                            Choose date/ time to rehost
                        </Text>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 15,
                                flexWrap: "wrap",
                                marginVertical: 20
                            }}
                        >
                            {dates?.map((item, index) => (
                                <Pressable
                                    onPress={() =>
                                        selectDate(
                                            item?.actualDate
                                        )
                                    }
                                    style={{
                                        padding: 10,
                                        borderRadius: 10,
                                        borderColor:
                                            "#E0E0E0",
                                        borderWidth: 1,
                                        width: "30%",
                                        justifyContent:
                                            "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Text>
                                        {item?.displayDate}
                                    </Text>
                                    <Text
                                        style={{
                                            color: "gray",
                                            marginTop: 8
                                        }}
                                    >
                                        {item?.dayOfWeek}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </ModalContent>
            </Modal> */}
        </>
    )
}

export default CreateActivity

const styles = StyleSheet.create({
    createActivityText: {
        fontSize: 20,
        fontFamily: fontFamily.bold
    },
    sportsText: {
        fontSize: 15,
        fontFamily: fontFamily.regular
    },
    activitiesAccessText: {
        fontSize: 15,
        fontFamily: fontFamily.regular,
        marginBottom: 8
    },
    totalPlayersText: {
        fontSize: 16,
        fontFamily: fontFamily.medium,
        marginTop: 10
    },
    totalPlayersContainer: {
        padding: 10,
        marginTop: 10,
        borderRadius: 6
    },
    addInstructionsContainer: {
        padding: 10,
        marginTop: 10,
        borderRadius: 8
    }
})
