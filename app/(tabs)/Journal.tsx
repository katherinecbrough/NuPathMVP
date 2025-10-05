import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import {
  addEntry,
  getData,
  deleteEntry,
} from "../../components/firebaseConfig"; // Import deleteEntry
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";
import { getAIResponse } from "../../components/openaiservice";
import { Entries } from "../../constants/Enums";
import {
  JournalEntryType,
  JournalTemplate,
  JournalTemplateID,
} from "../../constants/Enums";

interface JournalEntry {
  _id: string; // Add _id field for MongoDB document ID
  date: Date;
  type: string;
  template: string;
  templateId: number;
  question: string;
  content: string | AIQuestion[];
  userId?: string; // Add userId for safety
}
interface AIQuestion {
  id: number;
  question: string;
  answer: string;
}

type JournalScreenRouteProp = RouteProp<
  {
    Journal: {
      refreshNeeded?: boolean;
    };
  },
  "Journal"
>;

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];
type JournalTypeIconName =
  | "wb-sunny"
  | "nights-stay"
  | "keyboard-voice"
  | "photo-camera"
  | "list"
  | "edit"
  | "delete"; // Add delete icon

export default function Journal() {
  const navigation = useNavigation();
  const route = useRoute<JournalScreenRouteProp>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasEntries, setHasEntries] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiQuestionsModalVisible, setAiQuestionsModalVisible] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false); // New state for delete confirmation
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null); // Track which entry to delete
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete operation

  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Newest first
    });
  }, [entries]);

  const emojiAnimations = useRef(
    Array(10)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;

  const formatDate = (date: any): string => {
    try {
      let dateObj: Date;

      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === "string") {
        dateObj = new Date(date);
      } else {
        dateObj = new Date();
      }

      if (isNaN(dateObj.getTime())) {
        console.warn("Invalid date object:", date);
        return "Invalid date";
      }

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (dateObj.toDateString() === today.toDateString()) return "Today";
      if (dateObj.toDateString() === yesterday.toDateString())
        return "Yesterday";

      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, date);
      return "Date error";
    }
  };

  const getTypeIcon = (type: string): JournalTypeIconName => {
    switch (type) {
      case "morning":
        return "wb-sunny";
      case "night":
        return "nights-stay";
      case "voice":
        return "keyboard-voice";
      case "camera":
        return "photo-camera";
      case "todo":
        return "list";
      default:
        return "edit";
    }
  };

  useEffect(() => {
    if ((route.params as any)?.refreshNeeded) {
      (navigation as any).setParams({ refreshNeeded: false });
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [(route.params as any)?.refreshNeeded]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getData(Entries.Users);

      if (data.data[0].journal) {
        setHasEntries(true);
        const entryData = await getData(Entries.Journal);
        console.log("DATA");
        console.log(entryData.data);
        if (entryData.data) {
          setEntries(entryData.data);
          const journalContent = entryData.data;
          if (Array.isArray(journalContent)) {
            setEntries(journalContent);
            setIsLoading(false);
            console.log("Journal entries loaded:");
          } else {
            console.warn("Journal content is not an array:");
            setEntries([]);
            setHasEntries(false);
            setIsLoading(false);
          }
        } else {
          console.log("No journal content found");
          setEntries([]);
          setHasEntries(false);
          setIsLoading(false);
        }
      } else {
        console.log("User does not have journal or no user data");
        setEntries([]);
        setHasEntries(false);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        const data = await getData(Entries.Users);
        if (data.data[0].journal) {
          setHasEntries(true);
          const entryData = await getData(Entries.Journal);
          if (entryData.data) {
            setEntries(entryData.data);
          }
        }
        setIsLoading(false);
      };
      fetchData();
    }, [refreshTrigger])
  );

  const refreshEntries = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const openEntryDetails = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setModalVisible(true);
  };

  // New function to handle delete confirmation
  // Update your handleDeletePress function
  const handleDeletePress = (entry: JournalEntry) => {
    setEntryToDelete(entry);
    setModalVisible(false); // Close the entry modal first
    // Use a small timeout to ensure the first modal is closed
    setTimeout(() => {
      setDeleteConfirmVisible(true);
    }, 100);
  };

  // New function to confirm and execute deletion
  const confirmDelete = async () => {
    if (!entryToDelete) return;

    setIsDeleting(true);
    try {
      console.log("delete object");
      console.log(entryToDelete._id);
      const result = await deleteEntry(Entries.Journal, entryToDelete._id);

      if (result.success) {
        // Remove the entry from local state
        setEntries((prevEntries) =>
          prevEntries.filter((entry) => entry._id !== entryToDelete._id)
        );

        // Check if we have any entries left
        if (entries.length <= 1) {
          setHasEntries(false);
        }

        // Close both modals
        setModalVisible(false);
        setDeleteConfirmVisible(false);

        // Show success message
        Alert.alert("Success", "Journal entry deleted successfully");
      } else {
        Alert.alert("Error", "Failed to delete journal entry: " + result.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("Error", "An unexpected error occurred while deleting");
    } finally {
      setIsDeleting(false);
      setEntryToDelete(null);
    }
  };

  // New function to cancel deletion
  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
    setEntryToDelete(null);
  };

  const startCelebration = () => {
    scaleAnim.setValue(0);
    rotateAnim.setValue(0);
    bounceAnim.setValue(0);
    emojiAnimations.forEach((anim) => anim.setValue(0));

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    emojiAnimations.forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 400,
          delay: 1000,
          easing: Easing.in(Easing.exp),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closeCelebration = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccessModal(false);
    });
  };

  const handleGenerateJournal = async () => {
    if (!searchQuery.trim()) return;

    setIsGenerating(true);
    try {
      const aiResponse = await getAIResponse("journal", searchQuery);
      const questions = aiResponse
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((question, key) => ({
          id: key,
          question: question.replace(/^\d+\.\s*/, "").trim(),
          answer: "",
        }));

      setAiQuestions(questions);
      setCurrentQuestionIndex(0);
      setAiQuestionsModalVisible(true);
    } catch (error) {
      console.error("Error generating journal:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (text: string) => {
    const updatedQuestions = [...aiQuestions];
    updatedQuestions[currentQuestionIndex].answer = text;
    setAiQuestions(updatedQuestions);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < aiQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsSubmitting(true);
      const newEntry: JournalEntry = {
        _id: "", // This will be generated by MongoDB
        type: JournalEntryType.AIPrompt,
        template: JournalTemplate.AIPrompt,
        templateId: JournalTemplateID.AIPrompt,
        question: searchQuery,
        content: aiQuestions,
        date: new Date(),
      };
      try {
        const result = await addEntry(Entries.Journal, newEntry);
        if (result.success) {
          setHasEntries(true);
          setEntries((prevEntries) => [newEntry, ...prevEntries]);
          setShowSuccessModal(true);
          setTimeout(startCelebration, 100);
        } else {
          console.error("Failed to save answers:", result.error);
          Alert.alert(
            "Error",
            "Failed to save your answers. Please try again."
          );
        }
      } catch (e) {
        console.error("Failed to save answers:");
        Alert.alert("Error", "Failed to save your answers. Please try again.");
      }
      setIsSubmitting(false);
      setAiQuestionsModalVisible(false);
      setSearchQuery("");
      setAiQuestions([]);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Journal</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              (navigation as any).navigate("JournalPages/NewEntryScreen", {
                onEntrySaved: true,
              });
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* AI Journal Generation Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.generateText}>Generate Journal</Text>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="I am stressed..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleGenerateJournal}
            />
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateJournal}
              disabled={isGenerating}
            >
              <MaterialIcons
                name="auto-awesome"
                size={24}
                color={Colors.Primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.analyzeButton}>
          <Link href="/JournalPages/PatternAnalysisScreen">
            <Text style={styles.analyzeButtonText}>Analyze My Patterns</Text>
          </Link>
        </TouchableOpacity>

        {/* Recent Entries List */}
        <ScrollView style={styles.entriesContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.Primary} />
          ) : hasEntries && entries.length > 0 ? (
            sortedEntries.map((entry, index) => (
              <TouchableOpacity
                key={index}
                style={styles.entryCard}
                onPress={() => openEntryDetails(entry)}
              >
                <View style={styles.entryHeader}>
                  <View style={styles.entryType}>
                    <MaterialIcons
                      name={getTypeIcon(entry.type)}
                      size={16}
                      color={Colors.Primary}
                    />
                    <Text style={styles.entryTypeText}>{entry.type}</Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {entry.date ? formatDate(entry.date) : "Unknown date"}
                  </Text>
                </View>
                <Text style={styles.entryTemplate}>{entry.template}</Text>
                <Text style={styles.entryPreview} numberOfLines={2}>
                  {Array.isArray(entry.content)
                    ? `Q&A: ${entry.content.length} questions`
                    : entry.content || "No content"}
                </Text>
                <View style={styles.entryFooter}>
                  <Text style={styles.entryTime}>
                    {entry.date && entry.date instanceof Date
                      ? entry.date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : entry.date
                      ? new Date(entry.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="edit" size={50} color="#ccc" />
              <Text style={styles.emptyStateText}>No Journals Yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start your first journal entry to begin your journey!
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Entry Detail Modal */}
        {/* Entry Detail Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedEntry && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalDate}>
                      {formatDate(selectedEntry.date)}
                    </Text>
                    <View style={styles.modalTypeBadge}>
                      <MaterialIcons
                        name={getTypeIcon(selectedEntry.type)}
                        size={20}
                        color={Colors.Primary}
                      />
                      <Text style={styles.modalTypeText}>
                        {selectedEntry.type}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.modalTemplate}>
                    {selectedEntry.template}
                  </Text>
                  <Text style={[styles.modalTemplate, { color: "black" }]}>
                    {selectedEntry.question}
                  </Text>

                  {/* Scrollable content area */}
                  <View style={styles.scrollableContent}>
                    <ScrollView
                      style={styles.modalTextContainer}
                      contentContainerStyle={styles.scrollViewContent}
                      showsVerticalScrollIndicator={true}
                    >
                      {Array.isArray(selectedEntry.content) ? (
                        selectedEntry.content.map((qa, index) => (
                          <View key={index} style={styles.qaContainer}>
                            <Text style={styles.questionText}>
                              <Text style={styles.bold}>Q{index + 1}: </Text>
                              {qa.question}
                            </Text>
                            <Text style={styles.answerText}>
                              <Text style={styles.bold}>A: </Text>
                              {qa.answer}
                            </Text>
                            {index < selectedEntry.content.length - 1 && (
                              <View style={styles.separator} />
                            )}
                          </View>
                        ))
                      ) : (
                        <Text style={styles.modalText}>
                          {selectedEntry.content || "No content"}
                        </Text>
                      )}
                    </ScrollView>
                  </View>

                  {/* Footer with buttons */}
                  <View style={styles.modalFooterWithActions}>
                    <Text style={styles.modalTime}>
                      {selectedEntry.date
                        ? new Date(selectedEntry.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Time not available"}
                    </Text>

                    <View style={styles.modalActions}>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.deleteButton]}
                        onPress={() => handleDeletePress(selectedEntry)}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="delete" size={20} color="white" />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.modalButton, styles.closeButton]}
                        onPress={() => setModalVisible(false)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
        {/* Delete Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={deleteConfirmVisible}
          onRequestClose={cancelDelete}
        >
          <View style={styles.confirmModalContainer}>
            <Pressable
              style={styles.confirmModalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.confirmModalTitle}>Delete Journal Entry</Text>
              <Text style={styles.confirmModalText}>
                Are you sure you want to delete this journal entry? This action
                cannot be undone.
              </Text>

              <View style={styles.confirmModalActions}>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.cancelButton]}
                  onPress={cancelDelete}
                  disabled={isDeleting}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confirmButton, styles.deleteConfirmButton]}
                  onPress={confirmDelete}
                  disabled={isDeleting}
                  activeOpacity={0.7}
                >
                  {isDeleting ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.deleteConfirmButtonText}>Delete</Text>
                  )}
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Modal>
        {/* Loading Modal */}
        <Modal animationType="fade" transparent={true} visible={isGenerating}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color={Colors.Primary} />
              <Text style={styles.loadingText}>
                Generating thoughtful questions...
              </Text>
            </View>
          </View>
        </Modal>

        {/* AI Questions Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={aiQuestionsModalVisible}
          onRequestClose={() => setAiQuestionsModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.modalContainer}>
              <View
                style={[styles.modalContent, styles.aiQuestionsModalContent]}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Journal Questions</Text>
                  <Text style={styles.questionCounter}>
                    Question {currentQuestionIndex + 1} of {aiQuestions.length}
                  </Text>
                </View>

                <ScrollView
                  ref={scrollViewRef}
                  style={[
                    styles.modalTextContainer,
                    styles.aiQuestionsTextContainer,
                  ]}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.scrollViewContent}
                >
                  <Text style={styles.questionText}>
                    {aiQuestions[currentQuestionIndex]?.question}
                  </Text>
                  <TextInput
                    ref={textInputRef}
                    style={styles.answerInput}
                    multiline
                    placeholder="Type your answer here..."
                    value={aiQuestions[currentQuestionIndex]?.answer}
                    onChangeText={handleAnswerChange}
                    onContentSizeChange={() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }}
                  />
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.secondaryButton]}
                    onPress={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <Text style={styles.buttonText}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.primaryButton,
                      isSubmitting && styles.disabledButton,
                    ]}
                    onPress={handleNextQuestion}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text
                        style={[styles.buttonText, styles.primaryButtonText]}
                      >
                        {currentQuestionIndex === aiQuestions.length - 1
                          ? "Finish"
                          : "Next"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: Colors.Orange,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
    lineHeight: 28,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: Colors.Primary,
    fontWeight: "500",
  },
  analyzeButton: {
    backgroundColor: Colors.MainGreen,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  analyzeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  entriesContainer: {
    flex: 1,
  },
  entryCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  entryType: {
    flexDirection: "row",
    alignItems: "center",
  },
  entryTypeText: {
    marginLeft: 6,
    color: Colors.Primary,
    fontSize: 12,
    textTransform: "capitalize",
  },
  entryDate: {
    fontSize: 12,
    color: "#666",
  },
  entryTemplate: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  entryPreview: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  entryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryMood: {
    fontSize: 12,
    color: Colors.Primary,
    textTransform: "capitalize",
  },
  entryTime: {
    fontSize: 12,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    height: "80%", // Fixed height instead of maxHeight
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalDate: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3e5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modalTypeText: {
    marginLeft: 8,
    color: Colors.Primary,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  modalTemplate: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 15,
  },
  modalTextContainer: {
    // maxHeight: "60%",
    // marginBottom: 15,
    flex: 1,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  modalMood: {
    color: Colors.Primary,
    fontWeight: "500",
  },
  modalTime: {
    color: "#666",
  },
  modalCloseButton: {
    backgroundColor: Colors.Primary,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  generateText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.Primary,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  generateButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 8,
  },
  questionCounter: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },

  primaryButton: {
    backgroundColor: Colors.Primary,
  },
  secondaryButton: {
    backgroundColor: "#f0f0f0",
  },
  primaryButtonText: {
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  loadingContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.Primary,
    fontWeight: "600",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    // flexGrow: 1,
    paddingBottom: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  successModalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
  },
  successModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.Primary,
    marginTop: 15,
    marginBottom: 10,
  },
  successModalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  successModalButton: {
    backgroundColor: Colors.Orange,
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  successModalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  qaContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.Primary,
  },
  bold: {
    fontWeight: "bold",
    color: Colors.Primary,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
    marginHorizontal: 8,
  },
  answerText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 20,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  // For the AI Questions Modal specifically
  aiQuestionsModalContent: {
    width: "90%",
    maxHeight: "85%", // Increased from "80%" to "85%"
    height: "80%", // Add fixed height for better control
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Increase the text container height
  aiQuestionsTextContainer: {
    maxHeight: "70%", // Increased height for text area
    marginBottom: 15,
    flexGrow: 1, // Allow it to take available space
  },

  // Make answer input taller
  answerInput: {
    backgroundColor: "#f5f7fa",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    minHeight: 150, // Increased from 120 to 150
    maxHeight: 300, // Add max height for scrolling
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  // Add more padding to question text
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20, // Increased from 16 to 20
    lineHeight: 24,
    padding: 8,
  },

  // Make buttons more prominent
  //   modalButton: {
  //     padding: 15, // Increased from 12 to 15
  //     borderRadius: 10, // Increased from 8 to 10
  //     minWidth: 120, // Increased from 100 to 120
  //     alignItems: "center",
  //     marginHorizontal: 8, // Add spacing between buttons
  //   },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10, // Add gap between buttons
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: 5,
    minHeight: 44, // Minimum touch target size for accessibility
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
  },
  closeButton: {
    backgroundColor: Colors.Primary,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  // Delete confirmation modal styles
  confirmModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  confirmModalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    width: "80%",
    maxWidth: 300,
    alignItems: "center",
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  confirmModalText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  confirmModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  deleteConfirmButton: {
    backgroundColor: "#ff3b30",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  deleteConfirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  scrollableContent: {
    height: "65%", // Takes 65% of modal height
    marginBottom: 15,
  },
  modalFooterWithActions: {
    marginTop: "auto", // Pushes to bottom
  },
});
