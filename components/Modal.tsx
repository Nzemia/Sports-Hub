import { fontFamily } from "@/constants/fonts"
import React from "react"
import {
    View,
    Text,
    Pressable,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from "react-native"

interface DatePickerModalProps {
    modalVisible: boolean
    setModalVisible: (visible: boolean) => void
    dates: {
        id: string
        displayDate: string
        dayOfWeek: string
        actualDate: string
    }[]
    selectDate: (date: string) => void
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
    modalVisible,
    setModalVisible,
    dates,
    selectDate
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            {/* Close modal when tapping outside */}
            <TouchableWithoutFeedback
                onPress={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>
                                Choose date to host the game
                            </Text>

                            <View
                                style={styles.dateContainer}
                            >
                                {dates?.map(
                                    (item, index) => (
                                        <Pressable
                                            key={index}
                                            onPress={() => {
                                                selectDate(
                                                    item.actualDate
                                                )
                                                setModalVisible(
                                                    false
                                                )
                                            }}
                                            style={
                                                styles.dateButton
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.whenIsDayText
                                                }
                                            >
                                                {
                                                    item.displayDate
                                                }
                                            </Text>
                                            <Text
                                                style={
                                                    styles.dayText
                                                }
                                            >
                                                {
                                                    item.dayOfWeek
                                                }
                                            </Text>
                                        </Pressable>
                                    )
                                )}
                            </View>

                            {/* Close Button */}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() =>
                                    setModalVisible(false)
                                }
                            >
                                <Text
                                    style={styles.closeText}
                                >
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

// Styles
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContent: {
        width: "90%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        alignItems: "center"
    },
    title: {
        textAlign: "center",
        fontSize: 18,
        fontFamily: fontFamily.bold,
        marginBottom: 15
    },
    dateContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        marginBottom: 20
    },
    dateButton: {
        padding: 10,
        borderRadius: 10,
        borderColor: "#E0E0E0",
        borderWidth: 1,
        width: "30%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    },
    dayText: {
        fontFamily: fontFamily.medium,
        marginTop: 8
    },
    whenIsDayText: {
        fontFamily: fontFamily.italic
    },
    closeButton: {
        backgroundColor: "#FF5A5F",
        padding: 10,
        borderRadius: 5,
        width: "100%",
        alignItems: "center"
    },
    closeText: {
        color: "white",
        fontFamily: fontFamily.extraBold
    }
})

export default DatePickerModal
