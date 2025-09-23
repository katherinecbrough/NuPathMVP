import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="AI Therapists"
        options={{
          title: "Coach",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.2" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="DailyActivity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="directions-run" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Journal"
        options={{
          title: "Journal",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="pencil.and.list.clipboard.rtl"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="MentalHealthLibrary"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.circle.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
