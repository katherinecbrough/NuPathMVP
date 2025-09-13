import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";

type TherapyApproach =
  | "CBT"
  | "DBT"
  | "Psychodynamic"
  | "Humanistic"
  | "Solution-Focused";
type TherapistDemeanor =
  | "Gentle"
  | "Direct"
  | "Supportive"
  | "Challenging"
  | "Spiritual"
  | "Friend-like";
type CommunicationStyle =
  | "Formal"
  | "Casual"
  | "Professional"
  | "Conversational";

const TherapistCustomizationScreen = () => {
  // State for all customization options
  const [selectedApproaches, setSelectedApproaches] = useState<
    TherapyApproach[]
  >(["CBT"]);
  const [primaryDemeanor, setPrimaryDemeanor] =
    useState<TherapistDemeanor>("Gentle");
  const [communicationStyle, setCommunicationStyle] =
    useState<CommunicationStyle>("Professional");
  const [sessionPacing, setSessionPacing] = useState<number>(3); // 1-5 scale
  const [homeworkAssignments, setHomeworkAssignments] = useState<boolean>(true);
  const [mindfulnessIntegration, setMindfulnessIntegration] =
    useState<boolean>(true);
  const [humorEnabled, setHumorEnabled] = useState<boolean>(false);
  const [metaphorUsage, setMetaphorUsage] = useState<boolean>(true);
  const [specializations, setSpecializations] = useState<string[]>([
    "Anxiety",
    "Stress",
  ]);

  // Available options
  const therapyApproaches: TherapyApproach[] = [
    "CBT",
    "DBT",
    "Psychodynamic",
    "Humanistic",
    "Solution-Focused",
  ];
  const demeanors: TherapistDemeanor[] = [
    "Gentle",
    "Direct",
    "Supportive",
    "Challenging",
    "Spiritual",
    "Friend-like",
  ];
  const communicationStyles: CommunicationStyle[] = [
    "Formal",
    "Casual",
    "Professional",
    "Conversational",
  ];
  const specializationOptions = [
    "Anxiety",
    "Depression",
    "Trauma",
    "Relationships",
    "Stress",
    "Self-Esteem",
    "ADHD",
    "OCD",
  ];

  const toggleApproach = (approach: TherapyApproach) => {
    if (selectedApproaches.includes(approach)) {
      setSelectedApproaches(selectedApproaches.filter((a) => a !== approach));
    } else {
      setSelectedApproaches([...selectedApproaches, approach]);
    }
  };

  const toggleSpecialization = (specialization: string) => {
    if (specializations.includes(specialization)) {
      setSpecializations(specializations.filter((s) => s !== specialization));
    } else {
      setSpecializations([...specializations, specialization]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Customize Your Therapist</Text>

      {/* Therapy Approaches */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Therapy Approaches</Text>
        <Text style={styles.sectionSubtitle}>
          Select which therapeutic techniques you prefer
        </Text>
        <View style={styles.optionsContainer}>
          {therapyApproaches.map((approach) => (
            <TouchableOpacity
              key={approach}
              style={[
                styles.optionButton,
                selectedApproaches.includes(approach) && styles.selectedOption,
              ]}
              onPress={() => toggleApproach(approach)}
            >
              <Text style={styles.optionText}>{approach}</Text>
              {selectedApproaches.includes(approach) && (
                <MaterialIcons name="check" size={20} color={Colors.Primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Primary Demeanor */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Therapist Demeanor</Text>
        <Text style={styles.sectionSubtitle}>
          Choose how your therapist interacts with you
        </Text>
        <View style={styles.optionsContainer}>
          {demeanors.map((demeanor) => (
            <TouchableOpacity
              key={demeanor}
              style={[
                styles.optionButton,
                primaryDemeanor === demeanor && styles.selectedOption,
              ]}
              onPress={() => setPrimaryDemeanor(demeanor)}
            >
              <Text style={styles.optionText}>{demeanor}</Text>
              {primaryDemeanor === demeanor && (
                <MaterialIcons name="check" size={20} color={Colors.Primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Communication Style */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Communication Style</Text>
        <View style={styles.optionsContainer}>
          {communicationStyles.map((style) => (
            <TouchableOpacity
              key={style}
              style={[
                styles.optionButton,
                communicationStyle === style && styles.selectedOption,
              ]}
              onPress={() => setCommunicationStyle(style)}
            >
              <Text style={styles.optionText}>{style}</Text>
              {communicationStyle === style && (
                <MaterialIcons name="check" size={20} color={Colors.Primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Session Pacing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session Pacing</Text>
        <Text style={styles.sectionSubtitle}>
          Slower (more reflective) ↔ Faster (more solution-focused)
        </Text>
        <View style={styles.pacingContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.pacingOption,
                sessionPacing === num && styles.selectedPacing,
              ]}
              onPress={() => setSessionPacing(num)}
            >
              <Text style={styles.pacingText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Specializations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Focus Areas</Text>
        <Text style={styles.sectionSubtitle}>
          Select topics you want to focus on
        </Text>
        <View style={styles.optionsContainer}>
          {specializationOptions.map((specialization) => (
            <TouchableOpacity
              key={specialization}
              style={[
                styles.optionButton,
                specializations.includes(specialization) &&
                  styles.selectedOption,
              ]}
              onPress={() => toggleSpecialization(specialization)}
            >
              <Text style={styles.optionText}>{specialization}</Text>
              {specializations.includes(specialization) && (
                <MaterialIcons name="check" size={20} color={Colors.Primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Additional Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Preferences</Text>

        <View style={styles.preferenceRow}>
          <View>
            <Text style={styles.preferenceLabel}>Homework Assignments</Text>
            <Text style={styles.preferenceDescription}>
              Weekly exercises to practice between sessions
            </Text>
          </View>
          <Switch
            value={homeworkAssignments}
            onValueChange={setHomeworkAssignments}
            trackColor={{ false: "#f5f5f5", true: Colors.Primary }}
          />
        </View>

        <View style={styles.preferenceRow}>
          <View>
            <Text style={styles.preferenceLabel}>Mindfulness Integration</Text>
            <Text style={styles.preferenceDescription}>
              Include mindfulness exercises in sessions
            </Text>
          </View>
          <Switch
            value={mindfulnessIntegration}
            onValueChange={setMindfulnessIntegration}
            trackColor={{ false: "#f5f5f5", true: Colors.Primary }}
          />
        </View>

        <View style={styles.preferenceRow}>
          <View>
            <Text style={styles.preferenceLabel}>Use of Humor</Text>
            <Text style={styles.preferenceDescription}>
              Lighten the mood when appropriate
            </Text>
          </View>
          <Switch
            value={humorEnabled}
            onValueChange={setHumorEnabled}
            trackColor={{ false: "#f5f5f5", true: Colors.Primary }}
          />
        </View>

        <View style={styles.preferenceRow}>
          <View>
            <Text style={styles.preferenceLabel}>Metaphors & Stories</Text>
            <Text style={styles.preferenceDescription}>
              Explain concepts using metaphors
            </Text>
          </View>
          <Switch
            value={metaphorUsage}
            onValueChange={setMetaphorUsage}
            trackColor={{ false: "#f5f5f5", true: Colors.Primary }}
          />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Link href="/(tabs)/AI Therapists">
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </Link>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
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
    color: "#6200ee",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    width: "48%",
  },
  selectedOption: {
    borderColor: Colors.Primary,
    backgroundColor: "#f3e5f5",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  pacingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  pacingOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedPacing: {
    backgroundColor: Colors.Primary,
  },
  pacingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  selectedPacingText: {
    color: "white",
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  preferenceLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  preferenceDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: Colors.Primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TherapistCustomizationScreen;
