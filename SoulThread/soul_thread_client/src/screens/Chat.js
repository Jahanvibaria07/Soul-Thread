import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Chat() {
  const route = useRoute();
  const params = route?.params || {};
  const receiver = params.receiver || {};
  const match_id = params.match_id || null;
  const flatListRef = useRef(null)

  const { user: loggedInUser } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const receiverId = receiver?.profile_id;

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
    fetchMessages();
  }, 2000);

  return () => clearInterval(interval);
  }, [receiverId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://192.168.0.118:5000/user/message/chat",
        { receiver_id: receiverId },
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      setMessages(res.data.data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await axios.post(
        "http://192.168.0.118:5000/user/message/send",
        {
          receiver_id: receiverId,
          message_text: text,
        },
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      setText("");
      fetchMessages();
    } catch (err) {
    }
  };

  // 🔹 Render each message
  const renderItem = ({ item }) => {
    const isMine = item.sender_id === receiverId ? false : true;
     
    return (
      <View
        style={[
          styles.messageBubble,
          isMine ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.message_text}</Text>
        <Text style={styles.time}>
          {new Date(item.sent_at).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{receiver.full_name}</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.message_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatArea}
        inverted={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ref={flatListRef}
      />

      {/* Input box */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingTop:35,
    paddingBottom:10,
    backgroundColor: "#e08260",
    alignItems: "center"
  },

  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  chatArea: {
    padding: 15,
  },

  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },

  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
  },

  messageText: {
    fontSize: 15,
  },

  time: {
    fontSize: 10,
    color: "#777",
    marginTop: 4,
    alignSelf: "flex-end",
  },

  inputArea: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    padding:10
  },

  sendBtn: {
    backgroundColor: "#e08260",
    borderRadius: 20,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
