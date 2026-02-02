
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import EditText from "../../components/EditText";
import Button from "../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

export default function Signin({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignin = async () => {
    try {
      const result = await api.post("/user/signin", { email, password });
      
      login(result.data.data);


      // await AsyncStorage.setItem("token", token);
      // login(result)
      // navigation.navigate("Home")
      // setIsLoggedIn(true);
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <EditText label="Email" marginTop={20} onChangeText={setEmail} />
        <EditText
          label="Password"
          isPassword
          marginTop={10}
          onChangeText={setPassword}
        />

        <View style={styles.linkRow}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.link}>Signup</Text>
          </TouchableOpacity>
        </View>

        <Button title="Signin" marginTop={20} onPress={onSignin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "light-grey",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  linkRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  link: {
    fontWeight: "bold",
  },
});
