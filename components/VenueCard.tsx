import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React from "react"
import { useTheme } from "@/constants/ThemeProvider"
import { fontFamily } from "@/constants/fonts"
import { SafeAreaView } from "react-native-safe-area-context"
import { AntDesign } from "@expo/vector-icons"

type VenueCardProps = {
    item: {
        id: string
        image: string
        name: string
        rating: number
        address: string
    }
}

const VenueCard = ({ item }: VenueCardProps) => {
    const { theme } = useTheme()
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <View style={{ margin: 15, marginTop: 0 }}>
                <Pressable
                    style={{
                        backgroundColor: theme.secondary,
                        borderRadius: 5,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10
                    }}
                >
                    <View>
                        <Image
                            source={{ uri: item?.image }}
                            style={{
                                width: "100%",
                                height: 200,
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10
                            }}
                        />
                    </View>

                    <View
                        style={{
                            paddingVertical: 12,
                            paddingHorizontal: 10
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent:
                                    "space-between"
                            }}
                        >
                            <Text
                                style={[
                                    styles.venueName,
                                    { color: theme.text }
                                ]}
                            >
                                {item?.name?.length > 40
                                    ? item?.name.slice(
                                          0,
                                          40
                                      ) + "..."
                                    : item?.name}
                            </Text>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: 6,
                                    borderRadius: 10
                                }}
                            >
                                <AntDesign
                                    name={"star"}
                                    size={20}
                                    color={theme.text}
                                />
                                <Text
                                    style={[
                                        styles.ratingText,
                                        {
                                            color: theme.text
                                        }
                                    ]}
                                >
                                    {item?.rating}
                                </Text>
                            </View>
                        </View>

                        <Text
                            style={[
                                styles.addressText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            {item?.address?.length > 40
                                ? item?.address.slice(
                                      0,
                                      40
                                  ) + "..."
                                : item?.address}
                        </Text>

                        <View
                            style={{
                                height: 1,
                                borderWidth: 0.6,
                                borderColor: theme.text,
                                marginVertical: 10
                            }}
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent:
                                    "space-between"
                            }}
                        >
                            <Text
                                style={[
                                    styles.discountText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Upto 10% Off
                            </Text>
                            <Text
                                style={[
                                    styles.discountText,
                                    {
                                        color: theme.text
                                    }
                                ]}
                            >
                                Kshs. 1000 Onwards
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default VenueCard

const styles = StyleSheet.create({
    venueName: {
        fontFamily: fontFamily.medium,
        fontSize: 16
    },
    ratingText: {
        fontFamily: fontFamily.bold,
        fontSize: 12
    },
    addressText: {
        fontFamily: fontFamily.regular,
        fontSize: 12
    },
    discountText: {
        fontFamily: fontFamily.italic,
        fontSize: 12
    }
})
