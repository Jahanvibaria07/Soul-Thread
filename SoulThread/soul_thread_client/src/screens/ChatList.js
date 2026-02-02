import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function ChatsList() {
  const { user: loggedInUser } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await axios.get(
        "http://192.168.0.118:5000/user/matches",
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      setMatches(res.data.data || []);
    } catch (err) {
    }
  };

  const openChat = (item) => {
    navigation.navigate("Chat", {
      match_id: item.match_id,
      receiver: item,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userRow}
      onPress={() => openChat(item)}
    >
      <Image
        source={
          item.photo_url
            ? { uri: item.photo_url }
            : require("../../assets/default-users.png")
        }
        style={styles.avatar}
      />
      <Text style={styles.name}>{item.full_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.profile_id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 5,
    marginTop:40
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    borderRadius: 14,

    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    // Elevation for Android
    elevation: 4,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 14,
    backgroundColor: "#e0e0e0",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

