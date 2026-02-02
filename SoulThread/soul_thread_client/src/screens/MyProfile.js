import React, { useEffect, useState, useContext, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image
} from "react-native"
import { AuthContext } from "../context/AuthContext"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import api from "../services/api"
import axios from "axios"
import { launchImageLibrary } from "react-native-image-picker";
import ProfileUpdate from "./ProfileUpdate"
const defaultUserImage = require("../../assets/default-users.png");

export default function MyProfile() {
  const navigation = useNavigation()
  const { user,logout } = useContext(AuthContext)
  const[fullUser,setfullUser] = useState("")

  const [referesh,setReferesh] = useState(false)
  

  const handleLogout = async () => {
    try {
      await logout() 
      
    } catch (err) {
    }
  }

  useFocusEffect(
  useCallback(() => {
    getProfile();
  }, [user?.token])
);


  const getProfile = async () => {
    const result = await axios.get("http://192.168.0.118:5000/user/profile",
      {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    }
    )

    setfullUser(result.data.data)
  }


  const imageSource = fullUser?.photo_url
  ? { uri: `http://192.168.0.118:5000${fullUser.photo_url}` }
  : defaultUserImage;
  

const uploadPhoto = async (token) => {
  const result = await launchImageLibrary({
    mediaType: "photo",
    quality: 0.8,
  });

  if (result.didCancel) return;

  const photo = result.assets[0];

  const formData = new FormData();
  formData.append("photo", {
    uri: photo.uri,
    type: photo.type,
    name: photo.fileName || "profile.jpg",
  });

  const res = await axios.post(
    "http://192.168.0.118:5000/user/photo",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log("UPLOAD RES:", res.data);
};
return (
    <ScrollView style={styles.container}>
      

      <Image
              source={imageSource}
              style={styles.image}
              resizeMode="cover"
              
            />

      <Text style={styles.header}>👤 {fullUser.full_name}</Text>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {/* Profile Card */}
        <TouchableOpacity
          style={[styles.card,{ backgroundColor:"#f1b25d"}]}
          onPress={() => navigation.navigate("ProfileUpdate")}
        >
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.cardDesc}>Update your personal info</Text>
        </TouchableOpacity>

        {/* Preferences Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#5dade2" }]}
          onPress={() => navigation.navigate("Preferences")}
        >
          <Text style={styles.cardTitle}>Preferences</Text>
          <Text style={styles.cardDesc}>Update your partner preferences</Text>
        </TouchableOpacity>

        {/* Logout Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#e08260" }]}
          onPress={handleLogout}
        >
          <Text style={styles.cardTitle}>Logout</Text>
          <Text style={styles.cardDesc}>Sign out from your account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 20,
    marginTop:40
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  cardsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#e08260",
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
  },
  image: {
  width: 150,
  height: 150,
  borderWidth:1,
  borderRadius: 75,
  alignSelf: "center",
  marginBottom: 20,
},

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: "#fff",
  },
})