import { View, Text, StyleSheet,ScrollView } from "react-native";
import { useState,useEffect } from "react";
import EditText from "../components/EditText";
import Button from "../components/Button";
import api from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Preferences({ navigation }) {
  const [age_min, setAgeMin] = useState("");
  const [age_max, setAgeMax] = useState("");
  const [height_min, setHeightMin] = useState("");
  const [height_max, setHeightMax] = useState("");
  const [religion, setReligion] = useState("");
  const [caste, setCaste] = useState("");
  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [isEdit, setIsEdit] = useState(false);
const { user } = useContext(AuthContext);

  useEffect(() => {
  checkPreferenceStatus();
}, []);

const checkPreferenceStatus = async () => {
  try {
    const res = await api.get("/user/preference/status");

    if (res.data.data.preferenceCompleted) {
      setIsEdit(true);
      fetchPreferences();
    }
  } catch (err) {
    console.log("Preference status error:", err.message);
  }
};

const fetchPreferences = async () => {
  try {
    const res = await api.get("/user/preference");
    const p = res.data.data;

    setAgeMin(String(p.age_min));
    setAgeMax(String(p.age_max));
    setHeightMin(String(p.height_min));
    setHeightMax(String(p.height_max));
    setReligion(p.religion);
    setCaste(p.caste);
    setEducation(p.education);
    setOccupation(p.occupation);
    setLocation(p.location);
    setGender(p.gender);
  } catch (err) {
    console.log("Fetch preferences error:", err.message);
  }
};


const onSavePreferences = async () => {
  try {
    const payload = {
      age_min,
      age_max,
      height_min,
      height_max,
      religion,
      caste,
      education,
      occupation,
      location,
      gender,
    };

   const headers = {
  Authorization: `Bearer ${user.token}`,
};

const res = isEdit
  ? await api.put("/user/preference", payload, { headers })
  : await api.post("/user/preference", payload, { headers });


    if (res.data.status !== "success") {
      alert("Failed to save preferences");
      return;
    }

    navigation.replace("HomeTabs");
  } catch (err) {
    console.log("Preferences Error:", err.response?.data || err.message);
    alert("Server error");
  }
};

  return (
     <ScrollView style={styles.container} contentContainerStyle={{ paddingVertical: 40 }}>
      <View style={styles.card}>
        <Text style={styles.header}>Partner Preferences</Text>

        <EditText label="Min Age" marginTop={20} value={age_min} onChangeText={setAgeMin} />
        <EditText label="Max Age" marginTop={10} value={age_max} onChangeText={setAgeMax} />
        <EditText label="Min Height" marginTop={10} value={height_min} onChangeText={setHeightMin} />
        <EditText label="Max Height" marginTop={10} value={height_max} onChangeText={setHeightMax} />
        <EditText label="Religion" marginTop={10} value={religion} onChangeText={setReligion} />
        <EditText label="Caste" marginTop={10} value={caste} onChangeText={setCaste} />
        <EditText label="Education" marginTop={10} value={education} onChangeText={setEducation} />
        <EditText label="Occupation" marginTop={10} value={occupation} onChangeText={setOccupation} />
        <EditText label="Location" marginTop={10} value={location} onChangeText={setLocation} />
        <EditText label="Gender Preference" marginTop={10} value={gender} onChangeText={setGender} />

        <Button title="Save Preferences" marginTop={30} onPress={onSavePreferences} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 12,
    elevation: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e08260",
    textAlign: "center",
    marginBottom: 25,
  },
});