import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { colors } from "../../constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 16,
          height: 82,
          borderRadius: 26,
          backgroundColor: "rgba(255,255,255,0.96)",
          borderTopWidth: 0,
          shadowColor: "#1f3658",
          shadowOpacity: 0.16,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#9ba7b5",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          href: null,
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-review"
        options={{
          title: "Contribute",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle-outline" size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="premium"
        options={{
          title: "Premium",
          href: null,
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="crown" size={size - 1} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size + 1} color={color} />,
        }}
      />
    </Tabs>
  );
}
