import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Video Background */}
      <Video
        source={require("../assets/videos/main/nature-walk-through-lush-tropical-growth-2025-04-25-23-57-13-utc.mp4")}
        style={styles.backgroundVideo}
        shouldPlay
        isLooping
        isMuted
        resizeMode={ResizeMode.COVER}
      />
      <View style={styles.darkOverlay} />

      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>NuPath</Text>
        <Text style={styles.subtitle}>Your AI Companion</Text>

        <View style={styles.buttonContainer}>
          <Link href="/Auth/Login" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/Auth/Register" asChild>
            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={styles.tagline}>
          Begin your journey to self-discovery and emotional wellness
        </Text>
      </View>
    </View>
  );
}
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  registerButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12, // Smaller padding
    borderRadius: 30,
    marginBottom: 15,
    alignItems: "center",
    width: "80%", // Smaller width
    borderWidth: 1,
    borderColor: "white",
    margin: "auto",
  },

  registerButtonText: {
    color: "white",
    fontSize: 14, // Slightly smaller font
    fontWeight: "600",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Darker overlay (40% opacity black)
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(126, 168, 144, 0.4)", // #7ea890 with 40% opacity
  },
  content: {
    flex: 1,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    zIndex: 1,
  },
  title: {
    fontFamily: "PacificoRegular",
    fontSize: 60,
    color: "white",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    padding: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 40,
    fontFamily: "System",
    fontWeight: "300",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
    opacity: 0.8,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
  },
  buttonText: {
    color: "#006400",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "white",
  },
  tagline: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "System",
    fontWeight: "700",
    opacity: 0.9,
  },
});
HomeScreen.options = {
  title: "Home", // This becomes the back button label
};
