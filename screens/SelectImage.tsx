import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import { images } from "@/constants/data"
import { Ionicons } from "@expo/vector-icons"
import { fontFamily } from "@/constants/fonts"
import CustomTextInput from "@/components/TextInput"
import GoNextButton from "@/components/GoNextButton"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "@/configs/global"
import { useNavigation } from "expo-router"
import useRegistration from "@/hooks/useRegistration"
import { getRegistrationProgress } from "@/utils/RegistrationProgress"

type PreFinalNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "PreFinal"
>

const SelectImage = () => {
    const { theme } = useTheme()

    const navigation =
        useNavigation<PreFinalNavigationProp>()

    const [image, setImage] = useState("")

    const { validateAndSave, error } =
        useRegistration("Image")
    useEffect(() => {
        getRegistrationProgress("Image").then(
            progressData => {
                if (
                    progressData &&
                    progressData.imageUrls
                ) {
                    setImage(progressData.imageUrls)
                }
            }
        )
    }, [])

    const handleNext = async () => {
        const isValid = await validateAndSave({ image })
        if (isValid) {
            navigation.navigate("PreFinal")
        }
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background
            }}
        >
            <View style={{ marginHorizontal: 10 }}>
                <Ionicons
                    onPress={() => navigation.goBack()}
                    name="arrow-back"
                    size={24}
                    color="black"
                />
            </View>

            <View
                style={{
                    marginHorizontal: 10,
                    marginVertical: 15
                }}
            >
                <Text
                    style={[
                        styles.headerText,
                        { color: theme.text }
                    ]}
                >
                    Complete Your Profile
                </Text>

                <Text
                    style={[
                        styles.subHeaderText,
                        {
                            color: theme.text
                        }
                    ]}
                >
                    Select your Avatar
                </Text>
            </View>

            <View style={{ marginVertical: 25 }}>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Image
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            borderColor: "green",
                            borderWidth: 2,
                            resizeMode: "cover"
                        }}
                        source={{
                            uri: image
                                ? image
                                : images[0]?.image
                        }}
                    />
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 25,
                        justifyContent: "center"
                    }}
                >
                    {images?.map((item, index) => (
                        <Pressable
                            onPress={() =>
                                setImage(item?.image)
                            }
                            style={{ margin: 10, gap: 10 }}
                            key={index}
                        >
                            <Image
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 35,
                                    borderColor:
                                        image == item?.image
                                            ? "green"
                                            : "transparent",
                                    borderWidth: 2,
                                    resizeMode: "contain"
                                }}
                                source={{ uri: item.image }}
                            />
                        </Pressable>
                    ))}
                </View>

                <Text
                    style={[
                        styles.OrText,
                        {
                            color: theme.text
                        }
                    ]}
                >
                    OR
                </Text>
                <View
                    style={{
                        marginHorizontal: 20,
                        marginVertical: 20
                    }}
                >
                    <View>
                        <Text
                            style={[
                                styles.enterImageLinkText,
                                {
                                    color: theme.text
                                }
                            ]}
                        >
                            Enter Image link
                        </Text>

                        <CustomTextInput
                            value={image}
                            onChangeText={setImage}
                            placeholderTextColor={"gray"}
                            placeholder="Enter Image Link here"
                            style={{
                                padding: 18,
                                borderWidth: 1,
                                borderRadius: 10,
                                marginTop: 10
                            }}
                        />
                    </View>
                </View>

                <GoNextButton onPress={handleNext} />
            </View>
        </SafeAreaView>
    )
}

export default SelectImage

const styles = StyleSheet.create({
    headerText: {
        fontSize: 22,
        fontFamily: fontFamily.bold,
        textAlign: "center",
        marginTop: 20
    },
    subHeaderText: {
        fontSize: 14,
        fontFamily: fontFamily.italic
    },
    OrText: {
        fontSize: 17,
        fontFamily: fontFamily.extraBold,
        textAlign: "center"
    },
    enterImageLinkText: {
        fontSize: 16,
        fontFamily: fontFamily.regular
    }
})
