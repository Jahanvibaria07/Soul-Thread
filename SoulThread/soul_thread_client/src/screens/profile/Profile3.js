

import { View, Text, StyleSheet } from "react-native"
import { useState,useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import EditText from "../../components/EditText"
import Button from "../../components/Button"
import api,{backendUrl} from "../../services/api"

export default function Profile3({ navigation }) {
  const [hobbies, setHobbies] = useState("")
  const [about_me, setAboutMe] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
const {user} = useContext(AuthContext)
  const onFinish = async () => {
    try {
      const res =await api.put(`${backendUrl}/user/profile`, {
        hobbies,
        about_me,
        address,
        city,
        state,
        country,
      },{
        headers:{
        authorization: `Bearer ${user.token}`
        }
      })
      console.log("Profile3 API response:", res.data)

      if (res.data.status !== "success") {
        alert("Failed to complete profile")
        return
      }
      navigation.replace("Preferences")
    } catch(err){
       console.log("Profile3 Error:", err.response?.data || err.message)
      alert("Server error")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>About You</Text>
        </View>

        <EditText label="Hobbies" marginTop={20} onChangeText={setHobbies} />
        <EditText label="About Me" marginTop={10} onChangeText={setAboutMe} />
        <EditText label="Address" marginTop={10} onChangeText={setAddress} />
        <EditText label="City" marginTop={10} onChangeText={setCity} />
        <EditText label="State" marginTop={10} onChangeText={setState} />
        <EditText label="Country" marginTop={10} onChangeText={setCountry} />

        <Button title="Finish" marginTop={20} onPress={onFinish} />
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
