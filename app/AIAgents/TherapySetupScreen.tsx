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
import { Link } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

type TherapistOption = {
  id: string;
  name: string;
  image: any;
  description: string;
};

type BackgroundOption = {
  id: string;
  name: string;
  image: any;
};

type VoiceOption = {
  id: string;
  name: string;
  gender: string;
  language: string;
};

const therapistOptions: TherapistOption[] = [
  {
    id: "1",
    name: "Dr. Sarah",
    image:
      "https://res.cloudinary.com/kcb-software-design/image/upload/v1742779693/aria_kze9q3.png",
    description: "Cognitive Behavioral Therapy specialist",
  },
  {
    id: "2",
    name: "Dr. Marcus",
    image:
      "https://res.cloudinary.com/kcb-software-design/image/upload/v1747259017/Confident_Professional_Portrait_rlsomj.png",
    description: "Trauma-informed care specialist",
  },
  {
    id: "3",
    name: "Dr. Maya",
    image:
      "https://res.cloudinary.com/kcb-software-design/image/upload/v1743539116/portrait-of-smiling-brunette-young-woman-2024-09-23-01-08-15-utc_a0kuh2.jpg",
    description: "Trauma-informed care specialist",
  },
  {
    id: "4",
    name: "Dr. James",
    image:
      "https://res.cloudinary.com/kcb-software-design/image/upload/v1744755008/ChatGPT_Image_Apr_15_2025_05_09_49_PM_guipqs.png",
    description: "Mindfulness and meditation expert",
  },
  {
    id: "5",
    name: "Dr. Alex",
    image:
      "https://res.cloudinary.com/kcb-software-design/image/upload/v1747259468/3e2b5619-cac1-4d27-8b8b-b144d685817d_xxuq76.png",
    description: "Mindfulness and meditation expert",
  },
];

const backgroundOptions: BackgroundOption[] = [
  {
    id: "1",
    name: "Waterfall",
    image:
      "https://res.cloudinary.com/kcb-software-design/image/upload/v1745361360/portland-japanese-garden-waterfall-2025-04-04-00-11-03-utc_sysjwd.jpg",
  },
  {
    id: "2",
    name: "Nature View",
    image:
      "https://res.cloudinary.com/kcb-software-design/image/upload/v1745361360/beautiful-frame-made-by-meadow-and-big-trees-in-di-2025-03-24-06-55-54-utc_zrupwf.jpg",
  },
  {
    id: "3",
    name: "Cozy Space",
    image:
      "https://res.cloudinary.com/kcb-software-design/image/upload/v1745361360/styleish-room-interior-2025-02-10-12-11-41-utc_khksac.jpg",
  },
  {
    id: "4",
    name: "Grey Abstract",
    image:
      "https://res.cloudinary.com/kcb-software-design/image/upload/v1745361360/close-up-view-of-grey-empty-paper-sheet-abstract-b-2024-11-18-20-07-02-utc_bx3ekw.jpg",
  },
  {
    id: "5",
    name: "Beige",
    image:
      "https://res.cloudinary.com/kcb-software-design/image/upload/v1745361360/vintage-soft-textured-neutral-tones-background-2025-01-07-16-20-31-utc_h1ov4g.jpg",
  },
];

const voiceOptions: VoiceOption[] = [
  {
    id: "1",
    name: "Warm Female",
    gender: "female",
    language: "English",
  },
  {
    id: "2",
    name: "Calm Male",
    gender: "male",
    language: "English",
  },
  {
    id: "3",
    name: "Neutral Voice",
    gender: "neutral",
    language: "English",
  },
];

const TherapySetupScreen: React.FC = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistOption>(
    therapistOptions[0]
  );
  const [selectedBackground, setSelectedBackground] =
    useState<BackgroundOption>(backgroundOptions[0]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(
    voiceOptions[0]
  );
  const [activeTab, setActiveTab] = useState<
    "therapist" | "background" | "voice"
  >("therapist");

  const handleStartSession = () => {
    // Navigate to therapy session screen with selected options
    console.log("Starting session with:", {
      therapist: selectedTherapist,
      background: selectedBackground,
      voice: selectedVoice,
    });
    // navigation.navigate('TherapySession', { selectedTherapist, selectedBackground, selectedVoice });
  };
  const handleTestVoice = () => {
    // Implement voice testing functionality
    console.log("Testing voice:", selectedVoice.name);
    // You would use expo-speech or similar here
    // import * as Speech from 'expo-speech';
    // Speech.speak("This is a test of the voice system", {
    //   voice: selectedVoice.id,
    //   rate: 1.0
    // });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customize Your Session</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "therapist" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("therapist")}
        >
          <Text style={styles.tabText}>Therapist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "background" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("background")}
        >
          <Text style={styles.tabText}>Background</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "voice" && styles.activeTab]}
          onPress={() => setActiveTab("voice")}
        >
          <Text style={styles.tabText}>Voice</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {activeTab === "therapist" && (
          <>
            {therapistOptions.map((therapist) => (
              <TouchableOpacity
                key={therapist.id}
                style={[
                  styles.optionCard,
                  selectedTherapist.id === therapist.id &&
                    styles.selectedOption,
                ]}
                onPress={() => setSelectedTherapist(therapist)}
              >
                <Image
                  source={{ uri: therapist.image }}
                  style={styles.optionImage}
                />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>{therapist.name}</Text>
                  {/* <Text style={styles.optionDescription}>
                    {therapist.description}
                  </Text> */}
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {activeTab === "background" && (
          <>
            {backgroundOptions.map((background) => (
              <TouchableOpacity
                key={background.id}
                style={[
                  styles.optionCardBackground,
                  selectedBackground.id === background.id &&
                    styles.selectedOption,
                ]}
                onPress={() => setSelectedBackground(background)}
              >
                <Image
                  source={{ uri: background.image }}
                  style={styles.backgroundImage}
                />
                <Text style={styles.optionTitle}>{background.name}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {activeTab === "voice" && (
          <View style={styles.voiceOptionsContainer}>
            {voiceOptions.map((voice) => (
              <TouchableOpacity
                key={voice.id}
                style={[
                  styles.voiceOption,
                  selectedVoice.id === voice.id && styles.selectedVoiceOption,
                ]}
                onPress={() => setSelectedVoice(voice)}
              >
                <Text style={styles.voiceOptionText}>
                  {voice.name} ({voice.gender}, {voice.language})
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestVoice}
            >
              <Text style={styles.testButtonText}>
                Test {selectedVoice.name} Voice
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
        <Link href="/AIAgents/VideoCallScreenProto">
          <Text style={styles.startButtonText}>Start Session</Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: Colors.Primary,
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.Primary,
    paddingVertical: 10,
  },
  tabButton: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  tabText: {
    color: "white",
    fontWeight: "bold",
  },
  optionsContainer: {
    padding: 20,
  },
  optionCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionCardBackground: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "column",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: Colors.Primary,
  },
  optionImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  backgroundImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
  picker: {
    width: "100%",
  },

  startButton: {
    backgroundColor: Colors.Primary,
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  voiceOptionsContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
  voiceOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedVoiceOption: {
    backgroundColor: "#f0f0ff",
    borderLeftWidth: 4,
    borderLeftColor: Colors.Primary,
  },
  voiceOptionText: {
    fontSize: 16,
  },
  testButton: {
    backgroundColor: Colors.Primary,
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  testButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default TherapySetupScreen;
