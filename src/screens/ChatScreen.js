// RN
import {
    ImageBackground,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    View,
    Text,
} from "react-native";
import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";

// Components
import Message from "../components/Message";
import InputBox from "../components/InputBox";

// Assets
import bg from "../../assets/images/BG.png";

// AWS
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom, listMessagesByChatRoom } from "../graphql/queries";

const ChatScreen = () => {
    const [chatRoom, setChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);

    const route = useRoute();
    const navigation = useNavigation();

    const chatroomID = route.params.id;

    // Fetch Chat Room
    useEffect(() => {
        API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then(
            (result) => {
                setChatRoom(result.data?.getChatRoom);
                // setMessages(result.data?.getChatRoom.Messages?.items);
            }
        );
    }, [chatroomID]);

    // Fetch Messages
    useEffect(() => {
        API.graphql(
            graphqlOperation(listMessagesByChatRoom, {
                chatroomID,
                sortDirection: "DESC",
            })
        ).then((result) => {
            setMessages(result.data?.listMessagesByChatRoom?.items);
        });
    }, [chatroomID]);

    useEffect(() => {
        navigation.setOptions({ title: route.params.name });
    }, [route.params.name]);

    if (!chatRoom) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>
                    <ActivityIndicator size={"large"} />;
                </Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.bg}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 120}
        >
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => <Message message={item} />}
                    style={styles.list}
                    inverted
                    showsVerticalScrollIndicator={false}
                />
                <InputBox chatroom={chatRoom} />
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
    list: {
        padding: 10,
    },
});
export default ChatScreen;
