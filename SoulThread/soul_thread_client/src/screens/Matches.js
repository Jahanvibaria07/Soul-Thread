
import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function Matches() {
  const { user } = useContext(AuthContext);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tab, setTab] = useState("received");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation()

  useFocusEffect(
    useCallback(() => {
      fetchData();
      fetchMatches();
    }, [])
  );

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://192.168.0.118:5000/user/matches",
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMatches(res.data.data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const r1 = await axios.get(
        "http://192.168.0.118:5000/user/request/received",
        { headers }
      );
      const r2 = await axios.get(
        "http://192.168.0.118:5000/user/request/sent",
        { headers }
      );
      setReceived(r1.data.data || []);
      setSent(r2.data.data || []);
    } catch (err) {
    }
  };

  const acceptRequest = async (request_id) => {
    try {
      await axios.put(
        "http://192.168.0.118:5000/user/request/accept",
        { request_id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReceived((prev) =>
        prev.map((r) =>
          r.request_id === request_id ? { ...r, status: "Accepted" } : r
        )
      );
      Alert.alert("Accepted ❤️", "Request accepted");
    } catch {
      Alert.alert("Error", "Failed to accept request");
    }
  };

  const rejectRequest = async (request_id) => {
    try {
      await axios.put(
        "http://192.168.0.118:5000/user/request/reject",
        { request_id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReceived((prev) =>
        prev.map((r) =>
          r.request_id === request_id ? { ...r, status: "Rejected" } : r
        )
      );
      Alert.alert("Rejected ❌", "Request rejected");
    } catch {
      Alert.alert("Error", "Failed to reject request");
    }
  };

  /* ---------- RENDERERS ---------- */

  const renderReceived = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.full_name}</Text>

      <Text style={styles.status}>
        Status:{" "}
        <Text
          style={{
            color:
              item.status === "Accepted"
                ? "green"
                : item.status === "Rejected"
                ? "red"
                : "#e08260",
            fontWeight: "bold",
          }}
        >
          {item.status}
        </Text>
      </Text>

      {item.status === "Pending" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.accept]}
            onPress={() => acceptRequest(item.request_id)}
          >
            <Text style={styles.actionText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.reject]}
            onPress={() => rejectRequest(item.request_id)}
          >
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderSent = ({ item }) => (
    <TouchableOpacity>
      <View style={styles.card}>
      <Text style={styles.name}>{item.receiver_name}</Text>
      <Text
        style={{
          fontWeight: "bold",
          color:
            item.status === "Accepted"
              ? "green"
              : item.status === "Rejected"
              ? "red"
              : "#e08260",
        }}
      >
        {item.status}
      </Text>
    </View>
    </TouchableOpacity>
  );

  const renderMatch = ({ item }) => (
   <TouchableOpacity onPress={()=>navigation.navigate("UserProfile",{user:item})}>
     <View style={styles.card}>
      <Text style={styles.name}>{item.full_name}</Text>
      {!!item.city && <Text style={styles.sub}>{item.city}</Text>}
      {!!item.education && <Text style={styles.sub}>{item.education}</Text>}
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {["received", "sent", "matches"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}
          >
            <Text style={tab === t ? styles.activeText : styles.tabText}>
              {t === "matches" ? "Matches ❤️" : t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e08260" />
      ) : (
        <FlatList
          data={tab === "received" ? received : tab === "sent" ? sent : matches}
          keyExtractor={(item) =>
            item.request_id?.toString() || item.profile_id?.toString()
          }
          renderItem={
            tab === "received"
              ? renderReceived
              : tab === "sent"
              ? renderSent
              : renderMatch
          }
          contentContainerStyle={{ padding: 12 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  activeTab: {
    backgroundColor: "#e08260",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  activeText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  sub: {
    fontSize: 13,
    color: "#777",
  },
  status: {
    marginTop: 4,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  accept: {
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  reject: {
    backgroundColor: "#E53935",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});




// import React, { useState, useCallback ,useContext} from "react"
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator
// } from "react-native"
// import axios from "axios"
// import { AuthContext } from "../context/AuthContext"
// import { useFocusEffect } from "@react-navigation/native"
import UserProfile from './UserProfile';

// export default function Matches() {
//  const { user } = useContext(AuthContext)
//   const [received, setReceived] = useState([])
//   const [sent, setSent] = useState([])
//   const [tab, setTab] = useState("received")
//   const [matches, setMatches] = useState([])


//   useFocusEffect(
//     useCallback(() => {
//       fetchData()
//       fetchMatches()
//     }, [])
//   )
  
//  const fetchMatches = async () => {
//   try {
//     const res = await axios.get(
//       "http://192.168.0.118:5000/user/matches",
//       {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       }
//     )
//     setMatches(res.data.data || [])
//   } catch (err) {
//     console.log("Matches error:", err.message)
//   }
// }

//   const fetchData = async () => {
//     try {
//     const headers = {
//         Authorization: `Bearer ${user.token}`,
//       }
//       const r1 = await axios.get(
//         `http://192.168.0.118:5000/user/request/received`,
//         {headers}
//       )
//       const r2 = await axios.get(
//         `http://192.168.0.118:5000/user/request/sent`,
//         {headers}
//       )
//       setReceived(r1.data.data || [])
//       setSent(r2.data.data || [])
//     } catch (err) {
//       console.log("Fetch error:", err.response?.data || err.message)
//     }
//   }

//   const acceptRequest = async (request_id) => {
//     try {
//      await axios.put(
//         `http://192.168.0.118:5000/user/request/accept`,
//         { request_id },
//          {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       )
//         setReceived(prev =>
//         prev.map(req =>
//           req.request_id === request_id
//             ? { ...req, status: "Accepted" }
//             : req
//         )
//       )
//       Alert.alert("Accepted", "Request accepted ")
//     } catch {
//       Alert.alert("Error", "Failed to accept request")
//     }
//   }

//   const rejectRequest = async (request_id) => {
//     try {
//       await axios.put(
//         `http://192.168.0.118:5000/user/request/reject`,
//         { request_id },
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       )
//         setReceived(prev =>
//         prev.map(req =>
//           req.request_id === request_id
//             ? { ...req, status: "Rejected" }
//             : req
//         )
//       )
     
//       Alert.alert("Rejected", "Request rejected")
//     } catch {
//       Alert.alert("Error", "Failed to reject request")
//     }
//   }
// const renderReceived = ({ item }) => (
//     <View style={{ padding: 15, borderBottomWidth: 1 }}>
//       <Text style={{ fontWeight: "bold" }}>{item.full_name}</Text>
//       <Text style={{ marginTop: 5 }}>
//         Status: <Text style={{ fontWeight: "bold" }}>{item.status}</Text>
//       </Text>

//       {item.status === "Pending" && (
//         <View style={{ flexDirection: "row", marginTop: 10 }}>
//           <TouchableOpacity onPress={() => acceptRequest(item.request_id)}>
//             <Text style={{ color: "green", marginRight: 20 }}>Accept</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => rejectRequest(item.request_id)}>
//             <Text style={{ color: "red" }}>Reject</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   )

  
//   const renderSent = ({ item }) => (
//     <View style={{ padding: 15, borderBottomWidth: 1 }}>
//       <Text style={{ fontWeight: "bold" }}>{item.receiver_name}</Text>
//       <Text
//         style={{
//           marginTop: 5,
//           color:
//             item.status === "Accepted"
//               ? "green"
//               : item.status === "Rejected"
//               ? "red"
//               : "orange",
//           fontWeight: "bold",
//         }}
//       >
//         {item.status}
//       </Text>
//     </View>
//   )

 
//   const renderMatch = ({ item }) => (
//     <View style={{ padding: 15, borderBottomWidth: 1 }}>
//       <Text style={{ fontWeight: "bold" }}>{item.full_name}</Text>
//       <Text>{item.city || ""}</Text>
//       <Text>{item.education || ""}</Text>
//     </View>
//   )

//   return (
//     <View style={{ flex: 1 }}>
//       {/* Tabs */}
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-around",
//           marginTop: 40,
//         }}
//       >
//         <TouchableOpacity onPress={() => setTab("received")}>
//           <Text style={{ fontWeight: tab === "received" ? "bold" : "normal" }}>
//             Received
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => setTab("sent")}>
//           <Text style={{ fontWeight: tab === "sent" ? "bold" : "normal" }}>
//             Sent
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => setTab("matches")}>
//           <Text style={{ fontWeight: tab === "matches" ? "bold" : "normal" }}>
//             Matches ❤️
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={tab === "received" ? received : tab === "sent" ? sent : matches}
//         keyExtractor={item =>
//           item.request_id?.toString() || item.profile_id?.toString()
//         }
//         renderItem={
//           tab === "received"
//             ? renderReceived
//             : tab === "sent"
//             ? renderSent
//             : renderMatch
//         }
//       />
//     </View>
//   )
// }