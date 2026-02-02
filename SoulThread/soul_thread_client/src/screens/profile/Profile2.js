


import { View, Text, StyleSheet } from "react-native"
import { useState,useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import EditText from "../../components/EditText"
import Button from "../../components/Button"
import api ,{backendUrl}from "../../services/api"

export default function Profile2({ navigation }) {
  const [religion, setReligion] = useState("")
  const [caste, setCaste] = useState("")
  const [mother_tongue, setMotherTongue] = useState("")
  const [education, setEducation] = useState("")
  const [occupation, setOccupation] = useState("")
  const [income, setIncome] = useState("")
const {user} = useContext(AuthContext)
  const onNext = async () => {
    console.log("PROFILE 2 NEXT CLICKED")
    try {
     const res = await api.put(`${backendUrl}/user/profile`, {
        religion,
        caste,
        mother_tongue,
        education,
        occupation,
        income,
      },{
        headers:{
        authorization: `Bearer ${user.token}`
        }
      })
      console.log("Profile2 API response:", res.data)

      if (res.data.status !== "success") {
        alert("Failed to update profile")
        return
      }
      navigation.navigate("Profile3")
    } catch(err) {
       console.log("Profile2 Error:", err.response?.data || err.message)
      alert("Server error for profile")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Personal Details</Text>
        </View>

        <EditText label="Religion" marginTop={20} onChangeText={setReligion} />
        <EditText label="Caste" marginTop={10} onChangeText={setCaste} />
        <EditText label="Mother Tongue" marginTop={10} onChangeText={setMotherTongue} />
        <EditText label="Education" marginTop={10} onChangeText={setEducation} />
        <EditText label="Occupation" marginTop={10} onChangeText={setOccupation} />
        <EditText label="Income" marginTop={10} onChangeText={setIncome} />

        <Button title="Next" marginTop={20} onPress={onNext} />
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
