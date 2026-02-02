import React from "react"
import { Text, TouchableOpacity, StyleSheet,Image } from "react-native"
const defaultUserImage = require("../../assets/default-users.png");
export default function UserGridItem({ user, onPress }) {

 return (
    <TouchableOpacity style={styles.card} onPress={onPress}>

      {/* ✅ WRITE IMAGE HERE */}
      <Image
        source={
                  user.photo_url
                    ? { uri: user.photo_url }   // 🌐 server image
                    : defaultUserImage          // 🖼️ local image
                }
        style={styles.image}
      />

      <Text style={styles.name} numberOfLines={1}>
        {user.full_name}
      </Text>
    </TouchableOpacity>
  );
}

// const styles = StyleSheet.create({
//   card: {
//     width: "48%",
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 12,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 8,
//   },
//   name: {
//     fontSize: 14,
//     fontWeight: "bold",
//   },
// });
const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});