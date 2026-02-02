import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"

import Home from "../screens/Home"
import Matches from "../screens/Matches"
import MyProfile from "../screens/MyProfile"
import ChatsList from "../screens/ChatList"

const Tab = createBottomTabNavigator()

export default function BottomTabs() {
    console.log("BOTTOM TABS RENDERED")
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") iconName = focused ? "home" : "home-outline"
          if (route.name === "Matches") iconName = focused ? "heart" : "heart-outline"
          if (route.name === "ChatList") iconName = focused ? "chatbubble" : "chatbubble-outline"
          if (route.name === "MyProfile") iconName = focused ? "person" : "person-outline"

          return <Ionicons name={iconName} size={22} color={color} />
        },
        tabBarActiveTintColor: "#e08260",
        tabBarInactiveTintColor: "#999",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Matches" component={Matches} />
      <Tab.Screen name="ChatList" component={ChatsList} />
      <Tab.Screen name="MyProfile" component={MyProfile} />
    </Tab.Navigator>
  )
}
