import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Entries } from "../../constants/Enums";
import {
  getCurrentUserId,
  getData,
  addEntry,
  updateDocument,
} from "../../components/firebaseConfig";
type AnswerType = {
  [key: number]: string;
};

type DayData = {
  date: Date;
  hasActivity: boolean;
  hasTherapy: boolean;
  hasJournal: boolean;
};

const Dashboard = () => {
  // State for modals and data
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentCheatSheetQuestion, setCurrentCheatSheetQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerType>({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"questionnaire" | "review">(
    "questionnaire"
  );
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [cheatSheetData, setCheatSheetData] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(Entries.Users);
      if (data.data[0].cheatSheet) {
        setCheatSheetData(true);
        setViewMode("review");
        const sheetData = await getData(Entries.CheatSheet);
        sheetData.data[0].answers.forEach((answer: any) => {
          setAnswers((prev) => ({
            ...prev,
            [answer.questionId]: answer.answer,
          }));
        });
      }
    };
    fetchData();
  }, []);
  // Helper function to check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Format date for display (e.g., "April 25")
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  };
  // Mock data for days
  const generateDayData = () => {
    return [...Array(7)]
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i)); // Changed from -i to -(6-i)
        return {
          date,
          hasActivity: Math.random() > 0.3,
          hasTherapy: Math.random() > 0.5,
          hasJournal: Math.random() > 0.4,
        };
      })
      .reverse();
  };

  const [pastWeek, setPastWeek] = useState<DayData[]>(generateDayData());

  // Hardcoded data for prototype
  const stats = {
    daysUsed: 24,
    currentStreak: 7,
    longestStreak: 12,
    therapySessions: 20,
    journalEntries: 8,
  };

  const cheatSheetQuestions: string[] = [
    "What 3 things help you when you're stressed?",
    "What brings you happiness?",
    "What resources and activities help you?",
    "Who are your safe people?",
    "What are your early warning signs of distress?",
    "What grounding techniques work for you?",
    "what are 3 things I can do to distract myself when i'm feeling like i want to cope in a negative way?",
    "What are 5 minute strategies I can do to either calm, distract, or connect to myself?",
    "what sensory regulation techniques do I like (smell, sight, hearing, touch, taste)?",
    "What positive affirmations resonate with you?",
  ];

  const attachmentQuizQuestions = [
    {
      question: "How do you typically respond when your partner needs space?",
      options: [
        "I give them space but feel anxious and insecure",
        "I respect their need for space and feel comfortable",
        "I become clingy and demand reassurance",
        "I withdraw completely and shut down emotionally",
      ],
    },
    {
      question: "In relationships, how do you handle conflict?",
      options: [
        "I avoid conflict and try to keep the peace at all costs",
        "I address issues directly but calmly",
        "I become very emotional and need immediate resolution",
        "I shut down and withdraw from the situation",
      ],
    },
    {
      question: "How do you feel about emotional intimacy?",
      options: [
        "I crave it but fear rejection",
        "I'm comfortable with it and can maintain healthy boundaries",
        "I need constant reassurance and validation",
        "I find it difficult to open up and trust others",
      ],
    },
    {
      question: "When you're upset, how do you typically seek support?",
      options: [
        "I want support but fear being a burden",
        "I reach out to trusted people and accept help",
        "I need immediate attention and can't handle waiting",
        "I prefer to handle things alone and don't seek support",
      ],
    },
    {
      question: "How do you react to perceived rejection?",
      options: [
        "I feel anxious but try to manage my emotions",
        "I process it healthily and communicate my feelings",
        "I become very distressed and seek constant reassurance",
        "I withdraw and build emotional walls",
      ],
    },
  ];

  const affirmations = [
    "I am not defined by my struggles. I am shaped by my strength, softened by my compassion, and guided by the quiet hope that healing is always possible",
    "Even on the days I feel lost or unsure, I am still moving forward. I trust that every small step I take is part of a greater unfolding that I may not yet see.",
    "I deserve peace, not because I’ve earned it—but because I exist. I let go of pressure and perfection, and welcome gentleness into every corner of my life.",
    "Every breath is a reminder that I’m still here, still growing. I give myself permission to heal in layers, to show up as I am, and to believe in the possibility of something better.",
    "I am learning to trust myself, even when the path ahead feels uncertain. I honor my emotions, listen to my needs, and move forward at a pace that feels safe and true to me",
  ];

  const handleCheatSheetAnswer = async (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentCheatSheetQuestion]: answer,
    }));

    if (currentCheatSheetQuestion < cheatSheetQuestions.length - 1) {
      setCurrentCheatSheetQuestion(currentCheatSheetQuestion + 1);
    } else {
      await submitCheatSheet();
      setViewMode("review");
    }
  };
  const submitCheatSheet = async () => {
    // userId = getCurrentUserId();
    // Use a functional update to get the current state
    const currentAnswers = await new Promise<AnswerType>((resolve) => {
      setAnswers((prevAnswers) => {
        resolve(prevAnswers);
        return prevAnswers;
      });
    });
    // Prepare the complete answers payload
    const formattedAnswers = cheatSheetQuestions.map((question, index) => ({
      questionId: index,
      questionText: question,
      answer: currentAnswers[index] || "No answer provided",
    }));

    const payload = {
      completedAt: new Date().toISOString(),
      answers: formattedAnswers,
    };

    try {
      // Use your existing addEntry Firebase function
      if (!cheatSheetData) {
        const result = await addEntry(Entries.CheatSheet, payload);

        if (result.success) {
          console.log("Cheat sheet answers saved successfully!");

          // Optional: Update UI or show confirmation
        } else {
          console.error("Failed to save answers:", result.error);
          // Consider showing an error to the user
          Alert.alert(
            "Error",
            "Failed to save your answers. Please try again."
          );
        }
      } else {
        console.log("update");
        console.log(formattedAnswers);
        const result = await updateDocument("cheatSheet", {
          answers: formattedAnswers,
        });
        if (result.success) {
          console.log("Cheat sheet answers updated successfully!");
        } else {
          console.error("Failed to update answers:", result.error);
          Alert.alert(
            "Error",
            "Failed to update your answers. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error saving answers:", error);
      Alert.alert("Error", "An unexpected error occurred while saving.");
    }
  };

  const openCheatSheet = () => {
    setShowCheatSheet(true);
    // If we have answers, show review mode
    if (Object.keys(answers).length > 0) {
      setViewMode("review");
    } else {
      setViewMode("questionnaire");
      setCurrentCheatSheetQuestion(0);
    }
  };

  const startEditing = (index: number) => {
    setCurrentCheatSheetQuestion(index);
    setViewMode("questionnaire");
  };

  const getSelectedDayData = () => {
    return (
      pastWeek.find(
        (day) =>
          day.date.getDate() === selectedDate.getDate() &&
          day.date.getMonth() === selectedDate.getMonth()
      ) || pastWeek[0]
    );
  };

  const getRewardMessage = (days: number) => {
    if (days >= 30) return "🎉 Platinum User! 30+ days!";
    if (days >= 14) return "🌟 Gold Star! 2 weeks!";
    if (days >= 7) return "✨ Great job! 1 week!";
    return "Keep going!";
  };

  const handleQuizAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    setQuizAnswers([...quizAnswers, selectedAnswer]);
    setSelectedAnswer(null);

    if (currentQuizQuestion < attachmentQuizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      // Quiz completed
      setShowQuiz(false);
      setShowResults(true);
    }
  };

  const handleCancelQuiz = () => {
    setShowQuiz(false);
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
    setSelectedAnswer(null);
  };

  const handleRestartQuiz = () => {
    setShowResults(false);
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
    setSelectedAnswer(null);
    setShowQuiz(true);
  };

  const calculateAttachmentStyle = (answers: number[]) => {
    const styleCounts = {
      anxious: 0,
      secure: 0,
      avoidant: 0,
    };

    // Each answer maps to a specific attachment style tendency
    answers.forEach((answer) => {
      if (answer === 0) styleCounts.anxious++;
      if (answer === 1) styleCounts.secure++;
      if (answer === 2) styleCounts.anxious++;
      if (answer === 3) styleCounts.avoidant++;
    });

    // Determine primary attachment style
    if (
      styleCounts.secure > styleCounts.anxious &&
      styleCounts.secure > styleCounts.avoidant
    ) {
      return {
        style: "Secure",
        description:
          "You have a healthy balance of independence and connection. You're comfortable with intimacy and can maintain healthy boundaries in relationships.",
        tips: [
          "Continue practicing open communication",
          "Maintain your healthy boundaries",
          "Keep nurturing your self-awareness",
        ],
      };
    } else if (styleCounts.anxious > styleCounts.avoidant) {
      return {
        style: "Anxious",
        description:
          "You tend to seek high levels of intimacy and approval from partners. You may worry about rejection and need frequent reassurance.",
        tips: [
          "Practice self-soothing techniques",
          "Work on building self-confidence",
          "Try to give partners space when needed",
        ],
      };
    } else {
      return {
        style: "Avoidant",
        description:
          "You value independence and may struggle with emotional intimacy. You might withdraw when relationships become too close.",
        tips: [
          "Practice opening up gradually",
          "Work on identifying and expressing emotions",
          "Try to stay present during difficult conversations",
        ],
      };
    }
  };

  const results = calculateAttachmentStyle(quizAnswers);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.therapyButton]}>
            <Link href="/(tabs)/AI Therapists">
              <MaterialIcons name="healing" size={28} color="white" />
              <Text style={styles.actionButtonText}>Coach Session</Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.journalButton]}>
            <Link href="/JournalPages/NewEntryScreen">
              <Feather name="edit" size={28} color="white" />
              <Text style={styles.actionButtonText}>Journal Entry</Text>
            </Link>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {/* Calendar Slider */}
          <View style={styles.calendarContainer}>
            <ScrollView
              // style={{ transform: [{ scaleX: -1}]}}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.calendarScrollContainer}
            >
              {pastWeek.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    day.date.getDate() === selectedDate.getDate() &&
                      styles.selectedDateCard,
                  ]}
                  onPress={() => setSelectedDate(day.date)}
                >
                  <Text
                    style={[
                      styles.dateWeekday,
                      day.date.getDate() === selectedDate.getDate() &&
                        styles.selectedText,
                    ]}
                  >
                    {
                      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                        day.date.getDay()
                      ]
                    }
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      day.date.getDate() === selectedDate.getDate() &&
                        styles.selectedText,
                    ]}
                  >
                    {day.date.getDate()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Day Summary */}
          <View style={styles.daySummaryContainer}>
            <Text style={styles.daySummaryTitle}>
              {isToday(selectedDate)
                ? "Today's Activity"
                : `${formatDate(selectedDate)} Activity`}
            </Text>
            <View style={styles.daySummaryItems}>
              <View style={styles.daySummaryItem}>
                <Text style={styles.daySummaryLabel}>Activity</Text>
                {getSelectedDayData().hasActivity ? (
                  <MaterialIcons name="check" size={24} color="#4CAF50" />
                ) : (
                  <MaterialIcons name="close" size={24} color="#F44336" />
                )}
              </View>
              <View style={styles.daySummaryItem}>
                <Text style={styles.daySummaryLabel}>Coaching</Text>
                {getSelectedDayData().hasTherapy ? (
                  <MaterialIcons name="check" size={24} color="#4CAF50" />
                ) : (
                  <MaterialIcons name="close" size={24} color="#F44336" />
                )}
              </View>
              <View style={styles.daySummaryItem}>
                <Text style={styles.daySummaryLabel}>Journal</Text>
                {getSelectedDayData().hasJournal ? (
                  <MaterialIcons name="check" size={24} color="#4CAF50" />
                ) : (
                  <MaterialIcons name="close" size={24} color="#F44336" />
                )}
              </View>
            </View>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color={Colors.Primary}
                />
                <Text style={styles.statNumber}>{stats.daysUsed}</Text>
                <Text style={styles.statLabel}>Days Used</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons
                  name="whatshot"
                  size={20}
                  color={Colors.Primary}
                />
                <Text style={styles.statNumber}>{stats.currentStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="star" size={20} color={Colors.Primary} />
                <Text style={styles.statNumber}>{stats.therapySessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
            </View>

            {/* Reward Section */}
            <View style={styles.rewardContainer}>
              <Text style={styles.rewardText}>
                {getRewardMessage(stats.daysUsed)}
              </Text>
              <Text style={styles.rewardSubtext}>
                {stats.daysUsed} days of self-care!
              </Text>
            </View>
          </View>

          {/* Additional Features */}
          <View style={styles.featuresContainer}>
            <TouchableOpacity
              style={styles.featureButton}
              onPress={() => setShowQuiz(true)}
            >
              <MaterialIcons name="quiz" size={24} color={Colors.Primary} />
              <Text style={styles.featureButtonText}>
                Attachment Style Quiz
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureButton}
              onPress={() => setShowCheatSheet(true)}
            >
              <MaterialIcons
                name="lightbulb"
                size={24}
                color={Colors.Primary}
              />
              <Text style={styles.featureButtonText}>
                Mental Health Cheat Sheet
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureButton}>
              <Link href="/DashboardPages/FullSynopsisScreen">
                <MaterialIcons
                  name="summarize"
                  size={24}
                  color={Colors.Primary}
                />
                <Text style={styles.featureButtonText}>Full Synopsis</Text>
              </Link>
            </TouchableOpacity>
          </View>

          {/* Affirmations Section */}
          <View style={styles.affirmationsContainer}>
            <Text style={styles.sectionTitle}>Today's Affirmations</Text>
            <FlatList
              horizontal
              data={affirmations}
              renderItem={({ item }) => (
                <View style={styles.affirmationCard}>
                  <MaterialIcons
                    name="format-quote"
                    size={24}
                    color={Colors.Primary}
                  />
                  <Text style={styles.affirmationText}>{item}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Cheat Sheet Modal */}
          <Modal visible={showCheatSheet} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {viewMode === "questionnaire" ? (
                  <>
                    <Text style={styles.modalTitle}>
                      {cheatSheetQuestions[currentCheatSheetQuestion]}
                    </Text>
                    <TextInput
                      style={styles.answerInput}
                      multiline
                      placeholder="Type your answer here..."
                      onChangeText={(text) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentCheatSheetQuestion]: text,
                        }))
                      }
                      value={answers[currentCheatSheetQuestion] || ""}
                    />
                    <View style={styles.modalButtons}>
                      {currentCheatSheetQuestion > 0 && (
                        <TouchableOpacity
                          style={styles.modalButtonSecondary}
                          onPress={() =>
                            setCurrentCheatSheetQuestion(
                              currentCheatSheetQuestion - 1
                            )
                          }
                        >
                          <Text>Back</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.modalButtonPrimary}
                        onPress={() =>
                          handleCheatSheetAnswer(
                            answers[currentCheatSheetQuestion] || ""
                          )
                        }
                      >
                        <Text>
                          {currentCheatSheetQuestion <
                          cheatSheetQuestions.length - 1
                            ? "Next"
                            : "Finish"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.modalTitle}>
                      Your Mental Health Cheat Sheet
                    </Text>
                    <ScrollView style={styles.answersContainer}>
                      {cheatSheetQuestions.map((question, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.answerItem}
                          onPress={() => startEditing(index)}
                        >
                          <Text style={styles.questionText}>{question}</Text>
                          <Text style={styles.answerText}>
                            {answers[index] || (
                              <Text style={styles.emptyAnswer}>
                                Not answered yet
                              </Text>
                            )}
                          </Text>
                          <MaterialIcons
                            name="edit"
                            size={18}
                            color={Colors.Primary}
                            style={styles.editIcon}
                          />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <TouchableOpacity
                      style={styles.modalButtonPrimary}
                      onPress={() => setShowCheatSheet(false)}
                    >
                      <Text>Close</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </Modal>

          {/* Quiz Modal */}
          <Modal visible={showQuiz} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Attachment Style Quiz</Text>
                <Text style={styles.modalSubtitle}>
                  Question {currentQuizQuestion + 1} of{" "}
                  {attachmentQuizQuestions.length}
                </Text>
                <Text style={styles.questionText}>
                  {attachmentQuizQuestions[currentQuizQuestion].question}
                </Text>

                <View style={styles.quizOptions}>
                  {attachmentQuizQuestions[currentQuizQuestion].options.map(
                    (option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.quizOption,
                          selectedAnswer === index && styles.selectedQuizOption,
                        ]}
                        onPress={() => handleQuizAnswer(index)}
                      >
                        <Text
                          style={[
                            styles.quizOptionText,
                            selectedAnswer === index &&
                              styles.selectedQuizOptionText,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButtonSecondary, { marginRight: 10 }]}
                    onPress={handleCancelQuiz}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButtonPrimary,
                      selectedAnswer === null && styles.disabledButton,
                    ]}
                    onPress={handleNextQuestion}
                    disabled={selectedAnswer === null}
                  >
                    <Text>
                      {currentQuizQuestion < attachmentQuizQuestions.length - 1
                        ? "Next"
                        : "Finish"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Results Modal */}
          <Modal visible={showResults} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.resultsHeader}>
                  <Text style={styles.modalTitle}>Your Attachment Style</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowResults(false)}
                  >
                    <MaterialIcons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                <View style={styles.resultContainer}>
                  <Text style={styles.resultStyle}>{results.style}</Text>
                  <Text style={styles.resultDescription}>
                    {results.description}
                  </Text>

                  <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>Tips for Growth:</Text>
                    {results.tips.map((tip, index) => (
                      <View key={index} style={styles.tipItem}>
                        <MaterialIcons
                          name="check-circle"
                          size={20}
                          color={Colors.Primary}
                        />
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButtonPrimary, { width: "100%" }]}
                    onPress={handleRestartQuiz}
                  >
                    <Text>Take Quiz Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
    paddingBottom: 50,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  dateCard: {
    width: 60,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginRight: 10,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // transform: [{ scaleX: -1 }],
  },
  selectedDateCard: {
    backgroundColor: Colors.Primary,
  },
  dateWeekday: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  selectedText: {
    color: "white",
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  selectedDateCardText: {
    color: "white",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    width: "48%",
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  therapyButton: {
    backgroundColor: Colors.Primary,
  },
  journalButton: {
    backgroundColor: Colors.MainGreen,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
  },
  affirmationsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 16,
  },
  affirmationCard: {
    width: 280,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  affirmationText: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
    fontStyle: "italic",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    minHeight: 100,
    marginBottom: 20,
  },
  quizOptions: {
    marginBottom: 20,
  },
  quizOption: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedQuizOption: {
    backgroundColor: Colors.Primary,
    borderColor: Colors.Primary,
  },
  quizOptionText: {
    fontSize: 14,
    color: "#333",
  },
  selectedQuizOptionText: {
    color: "white",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButtonPrimary: {
    backgroundColor: Colors.Primary,
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  modalButtonSecondary: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
    marginRight: 10,
  },
  statsContainer: {
    marginBottom: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statCard: {
    width: "30%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  calendarScrollContainer: {
    justifyContent: "flex-end", // This pushes content to the right
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  answersContainer: {
    maxHeight: 400,
    marginBottom: 20,
  },
  answerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  questionText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  answerText: {
    fontSize: 15,
    color: "#555",
    marginRight: 25,
  },
  emptyAnswer: {
    color: "#999",
    fontStyle: "italic",
  },
  editIcon: {
    position: "absolute",
    right: 5,
    top: 20,
  },
  daySummaryContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  daySummaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 12,
  },
  daySummaryItems: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  daySummaryItem: {
    alignItems: "center",
    width: "30%",
  },
  daySummaryLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  rewardContainer: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    alignItems: "center",
  },
  rewardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 4,
  },
  rewardSubtext: {
    fontSize: 14,
    color: "#1976D2",
  },
  disabledButton: {
    opacity: 0.5,
  },
  resultContainer: {
    marginTop: 20,
  },
  resultStyle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.Primary,
    textAlign: "center",
    marginBottom: 15,
  },
  resultDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
  },
  tipsContainer: {
    marginTop: 10,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
});

export default Dashboard;
