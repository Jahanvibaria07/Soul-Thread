

import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { useState } from "react";


// Screens
import Signin from "../screens/auth/Signin";
import Signup from "../screens/auth/Signup";
import Profile1 from "../screens/profile/Profile1";
import Profile2 from "../screens/profile/Profile2";
import Profile3 from "../screens/profile/Profile3";
import Preferences from "../screens/Preferences";
import BottomTabs from "./BottomTabs";
import UserProfile from "../screens/UserProfile";
import MyProfile from "../screens/MyProfile";
import ProfileMenu from "../screens/ProfileMenu";
import ProfileUpdate from "../screens/ProfileUpdate";
import Logout from "../screens/Logout";
import axios from "axios";
import Chat from "../screens/Chat";

const Stack = createNativeStackNavigator();


function Loader() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text>Loading...</Text>
    </View>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}



export function PostLoginGate({ navigation }) {

  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !user.token) return; 

    const checkFlow = async () => {
      try {
        const profileUrl = "http://192.168.0.118:5000/user/profile/status";
        const preferenceUrl = "http://192.168.0.118:5000/user/preference/status";

        const [profileRes, prefRes] = await Promise.all([
          axios.get(profileUrl, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }),
          axios.get(preferenceUrl, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }),
        ]);
        console.log("profileRes",profileRes)
        console.log("prefRes",prefRes)

        if (!profileRes.data.data.profileCompleted) {
          navigation.replace("Profile1");
          return;
        }

        if (!prefRes.data.data.preferenceCompleted) {
          navigation.replace("Preferences");
          return;
        }

        navigation.replace("HomeTabs");

      } catch (err) {
        console.log("PostLoginGate error:", err.response?.data || err.message);
        navigation.replace("Profile1");
      }
    };

    checkFlow();
  }, [user]); 

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text>Post login gate Loading...</Text>
    </View>
  );
}



/* ---------------- APP STACK ---------------- */
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PostLoginGate" component={PostLoginGate} />
      <Stack.Screen name="Profile1" component={Profile1} />
      <Stack.Screen name="Profile2" component={Profile2} />
      <Stack.Screen name="Profile3" component={Profile3} />
      <Stack.Screen name="Preferences" component={Preferences} />
      <Stack.Screen name="HomeTabs" component={BottomTabs} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name = "Chat" component={Chat}/>
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="ProfileUpdate" component={ProfileUpdate}/>
      <Stack.Screen name="ProfileMenu" component={ProfileMenu} />
      <Stack.Screen name="Logout" component={Logout} />
    </Stack.Navigator>
  );
}

/* ---------------- MAIN NAVIGATOR ---------------- */
export default function AppNavigator() {
  // const { isLoggedIn, loading, setLoggedIn } = useContext(AuthContext);
  // const [checked, setChecked] = useState(false);

  // // Check AsyncStorage token on app start
  // useEffect(() => {
  //   const checkToken = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) setLoggedIn(true); // mark user as logged in
  //     setChecked(true);
  //   };
  //   checkToken();
  // }, []);

  // if (loading || !checked) return <Loader />;

  const {user} = useContext(AuthContext);

  console.log("user mil gya:",user)

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

