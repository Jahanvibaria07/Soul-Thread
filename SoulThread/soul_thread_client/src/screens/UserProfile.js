
import React, { useState, useContext, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native"
import { useRoute } from "@react-navigation/native"
import api from "../services/api"
import axios from "axios"
import { AuthContext } from './../context/AuthContext';
import Chat from "./Chat"
import { useNavigation } from "@react-navigation/native"
export default function UserProfile() {
  const route = useRoute()
  const { user } = route.params || {}
  const { user: loggedInUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false)
  const [otherUser,setOtherUser] = useState(null)
  const [requestSent, setRequestSent] = useState(false)
  const [isMatched, setIsMatched] = useState(false);
  const [matchId, setMatchId] = useState(null);
  const navigation = useNavigation()


  useEffect(() => {
    getFullProfile()
    checkIfRequestSent();
    checkIfMatched()
  }, []);

  const getFullProfile = async () => {
    console.log(user.profile_id)
    const result = await axios.get(`http://192.168.0.118:5000/user/profile/${user.profile_id}`,
        {
          headers: { Authorization: `Bearer ${loggedInUser.token}` },
        }
      )
      setOtherUser(result.data.data)
  }

  const checkIfMatched = async () => {
    try {
      if (!loggedInUser?.token) return;

      const res = await axios.get(
        `http://192.168.0.118:5000/user/match/status/${user.profile_id}`,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      if (res.data?.data?.matched) {
        setIsMatched(true);
        setMatchId(res.data.data.match_id);
      }
    } catch (err) {
    }
  };


  const checkIfRequestSent = async () => {
    try {
      if (!loggedInUser?.token) return;

      const res = await axios.get(
        "http://192.168.0.118:5000/user/request/sent",
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      const sentRequests = res.data?.data || [];

      const alreadySent = sentRequests.some(
        r => r.receiver_profile_id === user.profile_id
      );

      if (alreadySent) {
        setRequestSent(true);
      }
    } catch (err) {
    }
  };


  if (!user) {
    return (
      <View style={styles.center}>
        <Text>No User Data</Text>
      </View>
    )
  }


  const sendRequest = async () => {
    try {
      if (!loggedInUser?.token) {
        Alert.alert("Session expired", "Please login again");
        return;
      }

      const res = await axios.post(
        "http://192.168.0.118:5000/user/request/send",
        { receiver_id: user.profile_id },
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      if (res.data?.data?.alreadySent) {
        Alert.alert("Info", "Request already sent");
        setRequestSent(true);
        return;
      }

      if (res.data.status === "success") {
        Alert.alert("Success", "Request sent ");
        setRequestSent(true);
      }
    } catch (err) {
      console.log("Send request error:", err.response?.data || err.message);
      Alert.alert("Error", "Server error");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👤 {user.full_name} </Text>

      {user.photo_url ? (
        <Image
          source={{ uri: user.photo_url }}
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            alignSelf: "center",
            marginBottom: 20,
          }}
        />
      ) : (
        <Image
          source={require("../../assets/default-users.png")}
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            alignSelf: "center",
            marginBottom: 20,
          }}
        />
      )}
      {Object.entries(user).map(([key, value]) => {
       if (key === "photo_url") return null
        if (key == "user_id") return null
        if (key == "profile_id") return null


        return (
          <View key={key} style={styles.row}>
            <Text style={styles.key}>{key}</Text>
            <Text style={styles.value}>{String(value)}</Text>
          </View>
        );
      })}

      {/* START CHAT */}
      {isMatched ? (
        <TouchableOpacity
          style={[styles.requestBtn, { backgroundColor: "#4CAF50" }]}
        onPress={() =>
          navigation.navigate("Chat", {
            match_id: matchId,
            receiver: user,
          })
        }
        >
          <Text style={styles.requestText}>Start Chat 💬</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.requestBtn,
            requestSent && { backgroundColor: "#999" },
          ]}
          onPress={sendRequest}
          disabled={requestSent}
        >
          <Text style={styles.requestText}>
            {requestSent ? "Request Sent" : "Send Request ❤️"}
          </Text>
        </TouchableOpacity>
      )}


    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    // marginTop:10
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 6,
  },

  key: {
    width: 120,
    fontWeight: "bold",
    color: "#444",
  },

  value: {
    flex: 1,
    color: "#555",
  },

  requestBtn: {
    marginTop: 30,
    backgroundColor: "#e08260",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  requestText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})