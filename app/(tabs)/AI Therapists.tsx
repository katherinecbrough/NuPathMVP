import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";

const TherapyOptionsScreen = () => {
  // Hardcoded data for prototype
  const sessionCount = 12;
  const pastSessions = [
    { id: "1", type: "AI Chat", date: "2023-10-15", duration: "30 mins" },
    { id: "2", type: "Video Call", date: "2023-10-08", duration: "45 mins" },
    { id: "3", type: "Voice Call", date: "2023-10-01", duration: "30 mins" },
  ];
  const homeworkAssignments = {
    thisWeek: [
      {
        id: "hw1",
        title: "Thought Journaling",
        description: "Record 3 negative thoughts and reframe them positively",
        dueDate: "Due Tomorrow",
        completed: false,
      },
      {
        id: "hw2",
        title: "Mindfulness Exercise",
        description: "Practice 10 minutes of guided meditation daily",
        dueDate: "Due in 3 days",
        completed: true,
      },
    ],
    lastWeek: [
      {
        id: "hw3",
        title: "Gratitude List",
        description: "Write down 5 things you're grateful for each day",
        dueDate: "Completed",
        completed: true,
      },
      {
        id: "hw4",
        title: "Behavioral Experiment",
        description: "Test one anxious prediction and record the outcome",
        dueDate: "Completed",
        completed: true,
      },
    ],
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Coaching Center</Text>
            <View style={styles.sessionCounter}>
              <Text style={styles.sessionCounterText}>
                Total Sessions: {sessionCount}
              </Text>
            </View>
          </View>

          {/* Therapy Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Coaching Type</Text>

            <Link
              href="/AIAgents/Chatbot"
              asChild
              style={[styles.optionCard, styles.chatOption]}
            >
              <TouchableOpacity>
                <View style={styles.linkContent}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons
                      name="chat-bubble"
                      size={32}
                      color={Colors.Primary}
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.optionTitle}>AI Chat</Text>
                    <Text style={styles.optionDescription}>
                      Text-based support anytime
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>

            <Link
              href="/AIAgents/VoiceBot"
              asChild
              style={[styles.optionCard, styles.voiceOption]}
            >
              <TouchableOpacity>
                <View style={styles.linkContent}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons
                      name="call"
                      size={32}
                      color={Colors.Primary}
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.optionTitle}>AI Voice Call</Text>
                    <Text style={styles.optionDescription}>
                      Audio coaching sessions
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>

            <Link
              href="/AIAgents/TherapySetupScreen"
              asChild
              style={[styles.optionCard, styles.videoOption]}
            >
              <TouchableOpacity>
                <View style={styles.linkContent}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons
                      name="video-call"
                      size={32}
                      color={Colors.Primary}
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.optionTitle}>AI Video Call</Text>
                    <Text style={styles.optionDescription}>
                      Face-to-face virtual coaching
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Book Session */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Book a Session</Text>
            <TouchableOpacity style={styles.bookButton}>
              <MaterialIcons name="calendar-today" size={20} color="white" />
              <Text style={styles.bookButtonText}>Schedule Next Session</Text>
            </TouchableOpacity>
            <Text style={styles.notificationText}>
              You'll receive a reminder 15 mins before
            </Text>
          </View>

          {/* Therapist Customization */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coaching Preferences</Text>
            <TouchableOpacity style={styles.customizeButton}>
              <Link href="/AIAgents/TherapistCustomizationScreen">
                <MaterialIcons name="tune" size={20} color={Colors.Primary} />
                <Text style={styles.customizeButtonText}>
                  Customize Coach Style
                </Text>
              </Link>
            </TouchableOpacity>
            <Text style={styles.preferenceText}>
              Current: Cognitive Behavioral focus
            </Text>
          </View>
          {/* Homework Assignments */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Homework Assignments</Text>

            <Text style={styles.homeworkSubtitle}>This Week</Text>
            {homeworkAssignments.thisWeek.map((hw) => (
              <View
                key={hw.id}
                style={[
                  styles.homeworkCard,
                  hw.completed && styles.completedHomework,
                ]}
              >
                <MaterialIcons
                  name={
                    hw.completed ? "check-circle" : "radio-button-unchecked"
                  }
                  size={24}
                  color={hw.completed ? "#388e3c" : Colors.Primary}
                />
                <View style={styles.homeworkContent}>
                  <Text style={styles.homeworkTitle}>{hw.title}</Text>
                  <Text style={styles.homeworkDescription}>
                    {hw.description}
                  </Text>
                  <Text
                    style={[
                      styles.homeworkDueDate,
                      hw.completed && styles.completedDueDate,
                    ]}
                  >
                    {hw.dueDate}
                  </Text>
                </View>
              </View>
            ))}

            <Text style={styles.homeworkSubtitle}>Last Week</Text>
            {homeworkAssignments.lastWeek.map((hw) => (
              <View
                key={hw.id}
                style={[
                  styles.homeworkCard,
                  hw.completed && styles.completedHomework,
                ]}
              >
                <MaterialIcons
                  name={
                    hw.completed ? "check-circle" : "radio-button-unchecked"
                  }
                  size={24}
                  color={hw.completed ? "#388e3c" : Colors.Primary}
                />
                <View style={styles.homeworkContent}>
                  <Text style={styles.homeworkTitle}>{hw.title}</Text>
                  <Text style={styles.homeworkDescription}>
                    {hw.description}
                  </Text>
                  <Text
                    style={[
                      styles.homeworkDueDate,
                      hw.completed && styles.completedDueDate,
                    ]}
                  >
                    {hw.dueDate}
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addHomeworkButton}>
              <MaterialIcons name="add" size={20} color={Colors.Primary} />
              <Text style={styles.addHomeworkButtonText}>
                Add Personal Goal
              </Text>
            </TouchableOpacity>
          </View>
          {/* Past Sessions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Sessions</Text>
            {pastSessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionIcon}>
                  {session.type === "AI Chat" && (
                    <MaterialIcons
                      name="chat"
                      size={24}
                      color={Colors.Primary}
                    />
                  )}
                  {session.type === "Video Call" && (
                    <MaterialIcons
                      name="videocam"
                      size={24}
                      color={Colors.Primary}
                    />
                  )}
                  {session.type === "Voice Call" && (
                    <MaterialIcons
                      name="call"
                      size={24}
                      color={Colors.Primary}
                    />
                  )}
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionType}>{session.type}</Text>
                  <Text style={styles.sessionDate}>{session.date}</Text>
                </View>
                <Text style={styles.sessionDuration}>{session.duration}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  sessionCounter: {
    backgroundColor: Colors.Primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sessionCounterText: {
    color: "white",
    fontWeight: "600",
  },
  sessionIcon: {
    marginRight: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 16,
  },
  optionCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "column",
    alignItems: "center",
  },
  linkContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "column", // Stacks text vertically
    marginLeft: 12, // Space between icon and text
  },
  chatOption: {
    backgroundColor: "#e3f2fd",
  },
  voiceOption: {
    backgroundColor: "#f3e5f5",
  },
  videoOption: {
    backgroundColor: "#e8f5e9",
  },
  optionIcon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  bookButton: {
    backgroundColor: Colors.Primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  bookButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  notificationText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  customizeButton: {
    borderColor: Colors.Primary,
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  customizeButtonText: {
    color: Colors.Primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  preferenceText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  sessionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sessionInfo: {
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  sessionType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  sessionDate: {
    fontSize: 14,
    color: "#666",
  },
  sessionDuration: {
    fontSize: 14,
    color: Colors.Primary,
    fontWeight: "600",
  },
  homeworkSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.Primary,
    marginTop: 12,
    marginBottom: 8,
  },
  homeworkCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  completedHomework: {
    backgroundColor: "#e8f5e9",
    opacity: 0.8,
  },
  homeworkContent: {
    flex: 1,
    marginLeft: 12,
  },
  homeworkTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  homeworkDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  homeworkDueDate: {
    fontSize: 12,
    color: Colors.Primary,
    fontWeight: "600",
    marginTop: 4,
  },
  completedDueDate: {
    color: "#388e3c",
  },
  addHomeworkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.Primary,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  addHomeworkButtonText: {
    color: Colors.Primary,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default TherapyOptionsScreen;
