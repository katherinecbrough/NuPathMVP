import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

const PatternAnalysisScreen = () => {
  const navigation = useNavigation();

  // Mock analysis data
  const analysisData = {
    moodTrends: {
      description: "Your mood tends to dip on Sundays and peak on Fridays",
      chart: "📈 Highest moods: Friday (78%), Sunday (42%)",
      insight: "You frequently mention feeling tired on Sundays",
    },
    commonThemes: {
      positive: ["Family time", "Completed work projects", "Morning walks"],
      challenges: ["Work deadlines", "Social anxiety", "Trouble sleeping"],
    },
    recommendations: [
      "Try a wind-down routine on Sundays",
      "Keep prioritizing morning walks - they boost your mood",
      "Consider journaling about work stress earlier in the week",
    ],
    quote:
      "Progress isn't linear. You're growing in ways you can't even see yet.",
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={styles.header}>Your Journal Patterns</Text>
        <Text style={styles.subheader}>
          Based on 42 entries over the past 3 months
        </Text>

        {/* Mood Trends Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Mood Trends</Text>
          <Text style={styles.cardText}>
            {analysisData.moodTrends.description}
          </Text>
          <Text style={styles.cardDetail}>{analysisData.moodTrends.chart}</Text>
          <Text style={styles.insight}>
            ✨ Insight: {analysisData.moodTrends.insight}
          </Text>
        </View>

        {/* Common Themes Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔍 Common Themes</Text>

          <Text style={styles.sectionHeader}>What's Working Well:</Text>
          {analysisData.commonThemes.positive.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}

          <Text style={[styles.sectionHeader, { marginTop: 15 }]}>
            Challenges:
          </Text>
          {analysisData.commonThemes.challenges.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Recommendations Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💡 Recommendations</Text>
          {analysisData.recommendations.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Inspirational Quote */}
        <Text style={styles.quote}>"{analysisData.quote}"</Text>
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Journal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  content: {
    paddingBottom: 80,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subheader: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.Primary,
    marginBottom: 15,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 15,
  },
  insight: {
    fontSize: 15,
    color: "#2e7d32",
    backgroundColor: "#e8f5e9",
    padding: 10,
    borderRadius: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "flex-start",
  },
  bullet: {
    marginRight: 8,
    color: Colors.Primary,
  },
  listText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  quote: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#555",
    textAlign: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.Primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PatternAnalysisScreen;
