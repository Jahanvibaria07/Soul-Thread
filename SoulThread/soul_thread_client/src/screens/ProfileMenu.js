import { View, Text, StyleSheet } from "react-native"
import { useState } from "react"
import EditText from "../components/EditText"
import Button from "../components/Button"
import api from "../services/api"

export default function Preferences({ navigation }) {
  const [age_min, setAgeMin] = useState("")
  const [age_max, setAgeMax] = useState("")
  const [height_min, setHeightMin] = useState("")
  const [height_max, setHeightMax] = useState("")
  const [religion, setReligion] = useState("")
  const [caste, setCaste] = useState("")
  const [education, setEducation] = useState("")
  const [occupation, setOccupation] = useState("")
  const [location, setLocation] = useState("")
  const [gender, setGender] = useState("")

  const onSave = async () => {
    try {
      await api.post('/user/preference', {
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
      })

      navigation.replace("Home")
    } catch (err) {
      alert("Failed to save preference")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Partner Preference</Text>
        </View>

        <EditText label="Min Age" marginTop={20} onChangeText={setAgeMin} />
        <EditText label="Max Age" marginTop={10} onChangeText={setAgeMax} />
        <EditText label="Min Height" marginTop={10} onChangeText={setHeightMin} />
        <EditText label="Max Height" marginTop={10} onChangeText={setHeightMax} />
        <EditText label="Religion" marginTop={10} onChangeText={setReligion} />
        <EditText label="Caste" marginTop={10} onChangeText={setCaste} />
        <EditText label="Education" marginTop={10} onChangeText={setEducation} />
        <EditText label="Occupation" marginTop={10} onChangeText={setOccupation} />
        <EditText label="Location" marginTop={10} onChangeText={setLocation} />
        <EditText label="Gender Preference" marginTop={10} onChangeText={setGender} />

        <Button title="Save & Continue" marginTop={20} onPress={onSave} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3a391',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  titleContainer: {
    marginTop: -40,
    alignItems: 'center',
  },
  title: {
    backgroundColor: '#e08260',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 5,
  },
})
