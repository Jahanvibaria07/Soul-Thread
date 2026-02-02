import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import UserListItem from "../components/UserListItem";
import UserGridItem from "../components/UserGridItem";
import api from "../services/api";

export default function Home() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [listingType, setListingType] = useState("list");
  const [loading, setLoading] = useState(true);


  const fetchUsers = async () => {
  try {
    setLoading(true);
    const res = await axios.get("http://192.168.0.118:5000/user/matches-suggestions", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const fetchedUsers = res.data.data || [];

    // Fetch photo for each user
    const usersWithPhoto = await Promise.all(
    fetchedUsers.map(async (u) => {
    try {
      const photoRes = await axios.get(
        `http://192.168.0.118:5000/user/photo/${u.profile_id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const photoPath = photoRes.data.data?.photo_url;
      u.photo_url = photoPath
        ? `http://192.168.0.118:5000${photoPath}`
        : null;
    } catch (err) {
      u.photo_url = null;
    }
    return u;
  })
);

    setUsers(usersWithPhoto);
  } catch (err) {
  } finally {
    setLoading(false);
  }
};

  useFocusEffect(
    useCallback(() => {
       if (user?.token) {
      fetchUsers();
      };
    }, [user])
  );

 
  const renderItem = ({ item }) =>
    listingType === "list" ? (
      <UserListItem
        user={item}
        onPress={() => navigation.navigate("UserProfile", { user: item })}
       
      />
    ) : (
      <UserGridItem
        user={item}
        onPress={() => navigation.navigate("UserProfile", { user: item })}
      />
    );

  return (
    <View style={styles.container}>
      {/* Toggle */}
      <View style={styles.optionsContainer}>
        {["list", "grid"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setListingType(type)}
            style={[
              styles.optionButton,
              listingType === type && styles.activeButton,
            ]}
          >
            <Text style={styles.optionText}>{type.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* <View style={styles.heading}>
        <Text style={styles.headingText}>All Profiles - </Text>
      </View> */}

      <FlatList
        data={users}
        key={listingType}
        renderItem={renderItem}
        keyExtractor={(item) => item?.profile_id?.toString()}
        numColumns={listingType === "grid" ? 2 : 1}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={
          listingType === "grid" ? { justifyContent: "space-between" } : null
        }
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    marginTop: 35,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  optionButton: {
    width: 100,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#e6e6e6",
  },
  heading:{
    marginBottom:10,
    marginLeft:30,
    
  },
  headingText:{
    fontWeight:"bold",
    fontSize:20
  },
  activeButton: {
    backgroundColor: "#e08260",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});