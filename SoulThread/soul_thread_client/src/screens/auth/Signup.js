

import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import EditText from "../../components/EditText";
import Button from "../../components/Button";
import { useState } from "react";
import api from "../../services/api";

export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onSignup = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/user/signup", { email, password });
      alert("Signup successful");
      navigation.navigate("Signin");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <EditText label="Email" marginTop={20} onChangeText={setEmail} />
        <EditText label="Password" isPassword marginTop={10} onChangeText={setPassword} />
        <EditText label="Confirm Password" isPassword marginTop={10} onChangeText={setConfirm} />

        <View style={styles.linkRow}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
            <Text style={styles.link}>Signin</Text>
          </TouchableOpacity>
        </View>

        <Button title="Signup" marginTop={20} onPress={onSignup} />
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
