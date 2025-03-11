import React, {
    useContext,
    useEffect,
    useRef,
    useState
} from "react"
import {
    View,
    Text,
    TextInput,
    FlatList,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/constants/ThemeProvider"
import { AuthContext } from "@/context/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import axios from "axios"
import { fontFamily } from "@/constants/fonts"

interface Message {
    _id: string
    content: string
    sender: {
        _id: string
        firstName: string
        lastName: string
        image: string
    }
    timestamp: string
}

const ChatScreen = ({ route }) => {
    const { theme } = useTheme()
    const { userId } = useContext(AuthContext)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const flatListRef = useRef(null)
    const { gameId, gameName } = route.params

    useEffect(() => {
        fetchMessages()
    }, [gameId])

    const fetchMessages = async () => {
        try {
            const response = await axios.get(
                `http://10.16.13.88:3000/api/chat/${gameId}`
            )
            setMessages(response.data)
        } catch (error) {
            console.error("Error fetching messages:", error)
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return

        try {
            await axios.post(
                "http://10.16.13.88:3000/api/chat/send",
                {
                    gameId,
                    senderId: userId,
                    content: newMessage.trim()
                }
            )

            setNewMessage("")
            fetchMessages()
        } catch (error) {
            console.error("Error sending message:", error)
        }
    }

    const renderMessage = ({ item }: { item: Message }) => {
        const isOwnMessage = item.sender._id === userId

        return (
            <View
                style={[
                    styles.messageContainer,
                    isOwnMessage
                        ? styles.ownMessage
                        : styles.otherMessage
                ]}
            >
                <Text
                    style={[
                        styles.senderName,
                        { color: theme.text }
                    ]}
                >
                    {isOwnMessage
                        ? "You"
                        : `${item.sender.firstName} ${item.sender.lastName}`}
                </Text>
                <Text
                    style={[
                        styles.messageContent,
                        { color: theme.text }
                    ]}
                >
                    {item.content}
                </Text>
                <Text style={styles.timestamp}>
                    {new Date(
                        item.timestamp
                    ).toLocaleTimeString()}
                </Text>
            </View>
        )
    }

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: theme.background }
            ]}
        >
            <View style={styles.header}>
                <Text
                    style={[
                        styles.headerText,
                        { color: theme.text }
                    ]}
                >
                    {gameName}
                </Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item._id}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd()
                }
            />

            <KeyboardAvoidingView
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : "height"
                }
                style={styles.inputContainer}
            >
                <TextInput
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    placeholderTextColor={theme.text}
                    style={[
                        styles.input,
                        {
                            color: theme.text,
                            backgroundColor: theme.secondary
                        }
                    ]}
                    multiline
                />
                <Pressable
                    onPress={sendMessage}
                    style={styles.sendButton}
                >
                    <Ionicons
                        name="send"
                        size={24}
                        color={theme.text}
                    />
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0"
    },
    headerText: {
        fontSize: 18,
        fontFamily: fontFamily.bold
    },
    messageContainer: {
        margin: 10,
        padding: 10,
        borderRadius: 8,
        maxWidth: "80%"
    },
    ownMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#07bc0c"
    },
    otherMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#E0E0E0"
    },
    senderName: {
        fontSize: 12,
        fontFamily: fontFamily.bold,
        marginBottom: 4
    },
    messageContent: {
        fontSize: 14,
        fontFamily: fontFamily.regular
    },
    timestamp: {
        fontSize: 10,
        color: "#666",
        alignSelf: "flex-end",
        marginTop: 4
    },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0"
    },
    input: {
        flex: 1,
        padding: 10,
        borderRadius: 20,
        marginRight: 10,
        fontFamily: fontFamily.regular
    },
    sendButton: {
        justifyContent: "center",
        alignItems: "center",
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#07bc0c"
    }
})

export default ChatScreen
