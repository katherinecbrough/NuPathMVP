import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

type TemplateType = "blank" | "morning" | "night" | "todo" | "voice" | "camera";

const NewEntryScreen = () => {
  const [activeTab, setActiveTab] = useState("blank");
  const [entryText, setEntryText] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("");
  const navigation = useNavigation();
  const templateCategories = [
    {
      name: "Daily Reflection",
      templates: [
        "Morning Intentions",
        "Evening Reflection",
        "Daily Gratitude",
        "High/Low of the Day",
      ],
    },
    {
      name: "Mental Health",
      templates: [
        "Anxiety Check-in",
        "Mood Tracker",
        "Thought Challenge",
        "Self-Compassion Exercise",
      ],
    },
    {
      name: "Organization",
      templates: [
        "Priority Tasks",
        "Weekly Goals",
        "Brain Dump",
        "Meeting Notes",
      ],
    },
    {
      name: "Creative",
      templates: [
        "Free Writing",
        "Poetry Starter",
        "Character Sketch",
        "Dialogue Prompt",
      ],
    },
  ];
  const handleTemplateSelect = (template: string) => {
    setActiveTemplate(template);
    setShowTemplates(false);
    // In a real app, this would load the template content
    // alert(`Selected template: ${template}`);
  };
  // Mock functions for prototype
  const handleSave = () => {
    console.log("Entry saved:", entryText);
    navigation.goBack();
  };
  const handleCamera = () => console.log("open camera");
  const handleVoice = () => console.log("open voice");
  const handleTemplate = (type: TemplateType) => {
    setActiveTab(type);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Entry</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Entry Type Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.entryTypeContainer}
      >
        {(
          [
            "blank",
            "morning",
            "night",
            "todo",
            "voice",
            "camera",
          ] as TemplateType[]
        ).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.entryTypeButton,
              activeTab === type && styles.activeEntryType,
            ]}
            onPress={() => handleTemplate(type)}
          >
            <Text
              style={[
                styles.entryTypeText,
                activeTab === type && styles.activeEntryTypeText,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.moreTemplatesButton}
        onPress={() => setShowTemplates(true)}
      >
        <Text style={styles.moreTemplatesText}>More Templates...</Text>
      </TouchableOpacity>
      <Modal visible={showTemplates} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Journal Templates</Text>

            <ScrollView>
              {templateCategories.map((category) => (
                <View key={category.name} style={styles.categoryContainer}>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  {category.templates.map((template) => (
                    <TouchableOpacity
                      key={template}
                      style={styles.templateButton}
                      onPress={() => handleTemplateSelect(template)}
                    >
                      <Text style={styles.templateText}>{template}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTemplates(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {activeTab === "blank" && (
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Write your thoughts here..."
            value={entryText}
            onChangeText={setEntryText}
          />
        )}

        {activeTab === "morning" && (
          <View style={styles.templateContainer}>
            <Text style={styles.templateTitle}>Morning Reflection</Text>
            <Text style={styles.templatePrompt}>
              1. How did you sleep?{"\n"}
              2. What are you grateful for today?{"\n"}
              3. What would make today great?
            </Text>
          </View>
        )}

        {activeTab === "night" && (
          <View style={styles.templateContainer}>
            <Text style={styles.templateTitle}>Evening Reflection</Text>
            <Text style={styles.templatePrompt}>
              1. What went well today?{"\n"}
              2. What could have gone better?{"\n"}
              3. How do you feel now?
            </Text>
          </View>
        )}

        {activeTab === "todo" && (
          <View style={styles.templateContainer}>
            <Text style={styles.templateTitle}>To-Do List</Text>
            <TextInput
              style={[styles.textInput, { height: 150 }]}
              multiline
              placeholder="1. Task one\n2. Task two\n3. Task three"
            />
          </View>
        )}

        {activeTab === "voice" && (
          <View style={styles.centeredOption}>
            <TouchableOpacity style={styles.bigButton} onPress={handleVoice}>
              <Text style={styles.bigButtonText}>
                🎤 Tap to Record Voice Note
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "camera" && (
          <View style={styles.centeredOption}>
            <TouchableOpacity style={styles.bigButton} onPress={handleCamera}>
              <Text style={styles.bigButtonText}>📷 Scan Journal Page</Text>
            </TouchableOpacity>
            <Text style={styles.hintText}>
              Will extract text from your handwritten notes
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cancelButton: {
    color: Colors.Primary,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    color: Colors.Primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  entryTypeContainer: {
    maxHeight: 50,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  entryTypeButton: {
    paddingHorizontal: 17,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
  },
  activeEntryType: {
    backgroundColor: Colors.Primary,
  },
  entryTypeText: {
    color: "#333",
  },
  activeEntryTypeText: {
    color: "white",
  },
  contentArea: {
    flex: 1,
    padding: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: "top",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    elevation: 1,
  },
  templateContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 1,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.Primary,
  },
  templatePrompt: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  centeredOption: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bigButton: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    elevation: 2,
    width: "80%",
  },
  bigButtonText: {
    fontSize: 18,
    color: Colors.Primary,
  },
  hintText: {
    marginTop: 15,
    color: "#666",
    textAlign: "center",
  },
  moreTemplatesButton: {
    alignSelf: "center",
    marginVertical: 15,

    maxHeight: 80,
  },
  moreTemplatesText: {
    color: Colors.Primary,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    maxHeight: "80%",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.Primary,
    textAlign: "center",
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  templateButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 8,
  },
  templateText: {
    fontSize: 15,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: Colors.Primary,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default NewEntryScreen;
