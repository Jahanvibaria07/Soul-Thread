import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
// import { launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker"
const defaultUserImage = require("../../assets/default-users.png");

export default function ProfileUpdate() {
  const { user: loggedInUser } = useContext(AuthContext);
  const [fullUser, setfullUser] = useState("")
  console.log("user", loggedInUser)

  const [profile, setProfile] = useState({
    full_name: "",
    age: "",
    gender: "",
    height: "",
    religion: "",
    caste: "",
    mother_tongue: "",
    education: "",
    occupation: "",
    income: "",
    marital_status: "",
    hobbies: "",
    about_me: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });
  const imageSource = profile?.photo_url
    ? { uri: `http://192.168.0.118:5000${profile.photo_url}` }
    : defaultUserImage;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(
          "http://192.168.0.118:5000/user/profile",
          {
            headers: { Authorization: `Bearer ${loggedInUser.token}` },
          }
        );
        if (res.data.status === "success") {
          setProfile(res.data.data);
        }
      } catch (err) {
        console.log("Profile load error:", err.response?.data || err.message);
        Alert.alert("Error", "Failed to load profile");
      }
    };
    loadProfile();
    //getProfile()
  }, []);

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

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow photo access");
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })
    if (result.didCancel) return null;
    return result.assets[0];
  }

  const addPhoto = async () => {
    const photo = await pickPhoto()

    if (!photo) return;

    const formData = new FormData()
    formData.append("photo",
      {
        uri: photo.uri,
        type: "image/jpeg",
        name: "profile.jpg",
      }
    )

    try {
      const res = await axios.post(
        "http://192.168.0.118:5000/user/photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Alert.alert("Success", "Photo added ✅");
      setProfile((prev) => ({
        ...prev,
        photo_url: res.data.data.photo_url, // adjust if needed
      }));
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add photo");
    }
  }

  const updatePhoto = async () => {
    const photo = await pickPhoto()

    if (!photo) return;

    const formData = new FormData()
    formData.append("photo",
      {
        uri: photo.uri,
        type: "image/jpeg",
        name: "profile.jpg",
      }
    )

    try {
      const res = await axios.post(
        "http://192.168.0.118:5000/user/photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Alert.alert("Success", "Photo updated ✅");
      setProfile((prev) => ({
        ...prev,
        photo_url: res.data.data.photo_url,
      }));
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update photo");
    }
  }


  const updateProfile = async () => {
    try {
      const res = await axios.put(
        "http://192.168.0.118:5000/user/profile/update",
        profile,
        { headers: { Authorization: `Bearer ${loggedInUser.token}` } }
      );
      if (res.data.status === "success") {
        Alert.alert("Success", "Profile updated ✅");
      } else {
        Alert.alert("Ok", "Not updated");
      }
    } catch (err) {
      console.log("Update profile error:", err.response?.data || err.message);
      Alert.alert("Error", "Server error");
    }
  };


  const renderInput = (label, key, keyboardType = "default") => (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={profile[key] ? String(profile[key]) : ""}
        keyboardType={keyboardType}
        onChangeText={(v) => setProfile({ ...profile, [key]: v })}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Update Profile</Text>

      <Image
        source={imageSource}
        style={styles.image}
        resizeMode="cover"

      />
      <TouchableOpacity
        style={[
          styles.photoBtn,
          { backgroundColor: profile.photo_url ? "#5dade2" : "#27ae60" },
        ]}
        onPress={profile.photo_url ? updatePhoto : addPhoto}
      >
        <Text style={styles.photoBtnText}>
          {profile.photo_url ? "Update Photo" : "Add Photo"}
        </Text>
      </TouchableOpacity>



      {renderInput("Full Name", "full_name")}
      {renderInput("Age", "age", "numeric")}
      {renderInput("Gender", "gender")}
      {renderInput("Height", "height")}
      {renderInput("Religion", "religion")}
      {renderInput("Caste", "caste")}
      {renderInput("Mother Tongue", "mother_tongue")}
      {renderInput("Education", "education")}
      {renderInput("Occupation", "occupation")}
      {renderInput("Income", "income")}
      {renderInput("Marital Status", "marital_status")}
      {renderInput("Hobbies", "hobbies")}
      {renderInput("About Me", "about_me")}
      {renderInput("Address", "address")}
      {renderInput("City", "city")}
      {renderInput("State", "state")}
      {renderInput("Country", "country")}

      <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fafafa",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  image: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderRadius: 75,
    alignSelf: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveBtn: {
    backgroundColor: "#e08260",
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
    marginBottom: 30,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  photoBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },

  photoBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

});
