
import { View, Text, StyleSheet } from "react-native"
import { useContext, useState } from "react"
import EditText from "../../components/EditText"
import Button from "../../components/Button"
import api, { backendUrl } from "../../services/api"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"

export default function Profile1({ navigation }) {
  const [full_name, setFullName] = useState("")
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")
  const [height, setHeight] = useState("")
  const [marital_status, setMaritalStatus] = useState("")

  const {user} = useContext(AuthContext)

  const onNext = async () => {
     console.log("NEXT CLICKED");
    try {
     const result = await axios.post(`${backendUrl}/user/profile`, {
        full_name,
        gender,
        age,
        height,
        marital_status,
      },{
        headers:{
          authorization: `Bearer ${user.token}`
        }
      })

      console.log("profile 1",result.data)

      navigation.navigate("Profile2")

    } catch(err) {
      console.log("PROFILE API ERROR:", err.message)
      alert("Failed to save profile")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Basic Details</Text>
        </View>

        <EditText label="Full Name" marginTop={20} onChangeText={setFullName} />
        <EditText label="Gender" marginTop={10} onChangeText={setGender} />
        <EditText label="Age" marginTop={10} onChangeText={setAge} />
        <EditText label="Height" marginTop={10} onChangeText={setHeight} />
        <EditText label="Marital Status" marginTop={10} onChangeText={setMaritalStatus} />

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
