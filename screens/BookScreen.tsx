import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { fontFamily } from "@/constants/fonts"
import CustomTextInput from "@/components/TextInput"
import { data, venues } from "@/constants/data"
import VenueCard from "@/components/VenueCard"

const BookScreen = () => {
    const { theme } = useTheme()

    const [search, setSearch] = useState("")

    const handleSearch = () => {}
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 12
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 10,
                        gap: 5
                    }}
                >
                    <Text
                        style={[
                            styles.headerText,
                            { color: theme.text }
                        ]}
                    >
                        Frank
                    </Text>
                    <MaterialIcons
                        name={"keyboard-arrow-down"}
                        size={30}
                        color={theme.text}
                    />
                </View>

                {/** icons and profile */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10
                    }}
                >
                    <Ionicons
                        name={"chatbox-outline"}
                        size={24}
                        color={theme.text}
                    />
                    <Ionicons
                        name={"notifications-outline"}
                        size={24}
                        color={theme.text}
                    />

                    <Pressable>
                        <Image
                            source={require("../assets/images/profileavatar.png")}
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15
                            }}
                        />
                    </Pressable>
                </View>
            </View>

            {/** search */}
            <View style={styles.searchContainer}>
                <CustomTextInput
                    placeholder="Search For Venues ..."
                    placeholderTextColor={theme.text}
                    style={{
                        color: theme.text,
                        borderColor: theme.text,
                        width: "100%"
                    }}
                    value={search}
                    onChangeText={setSearch}
                />

                <Ionicons
                    name="search"
                    size={24}
                    color="theme.text"
                    style={styles.searchIcon}
                />
            </View>

            <Pressable
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    padding: 13
                }}
            >
                <View
                    style={{
                        padding: 5,
                        borderRadius: 10,
                        borderColor: theme.text,
                        borderWidth: 2
                    }}
                >
                    <Text
                        style={[
                            styles.availabilityText,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        Availability
                    </Text>
                </View>
                <View
                    style={{
                        padding: 5,
                        borderRadius: 10,
                        borderColor: theme.text,
                        borderWidth: 2
                    }}
                >
                    <Text
                        style={[
                            styles.availabilityText,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        Favorites
                    </Text>
                </View>
                <View
                    style={{
                        padding: 5,
                        borderRadius: 10,
                        borderColor: theme.text,
                        borderWidth: 2
                    }}
                >
                    <Text
                        style={[
                            styles.availabilityText,
                            {
                                color: theme.text
                            }
                        ]}
                    >
                        Offers
                    </Text>
                </View>
            </Pressable>

            <FlatList
                data={venues}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <VenueCard item={item} />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={{
                    paddingBottom: 20
                }}
            />
        </SafeAreaView>
    )
}

export default BookScreen

const styles = StyleSheet.create({
    headerText: {
        fontFamily: fontFamily.bold,
        fontSize: 20
    },
    searchContainer: {
        position: "relative",
        marginTop: 0,
        marginHorizontal: 12
    },
    searchIcon: {
        position: "absolute",
        right: 10,
        top: "50%",
        transform: [{ translateY: -12 }]
    },
    availabilityText: {
        fontFamily: fontFamily.medium
    }
})
