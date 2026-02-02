
import React from "react";
import { Text, TouchableOpacity, Image, StyleSheet, View } from "react-native";
const defaultUserImage = require("../../assets/default-users.png");

export default function UserListItem({ user, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      
      <Image
        source={
          user.photo_url
            ? { uri: user.photo_url }   // 🌐 server image
            : defaultUserImage          // 🖼️ local image
        }
        style={styles.image}
        
      />

       <View style={styles.info}>
        <Text style={styles.name}>{user.full_name}</Text>
        <Text style={styles.subText}>View Profile</Text>
      </View>
    </TouchableOpacity>
  );
}


// const styles = StyleSheet.create({
//   card: {
//     flexDirection: "row",
//     padding: 12,
//     marginVertical: 6,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   image: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 12,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    alignItems: "center",

    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  subText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
});