import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";

type Question = {
  id: number;
  title: string;
  type: "single" | "multi" | "text";
  options?: string[];
  placeholder?: string;
};

const INTAKE_QUESTIONS: Question[] = [
  {
    id: 1,
    title: "What's your level of experience with therapy?",
    type: "single",
    options: [
      "Just starting out - First time exploring therapy/wellness",
      "Some experience - Tried a few sessions or self-help tools",
      "Very experienced - Regular therapy participant",
      "Prefer not to answer",
    ],
  },
  {
    id: 2,
    title: "Which therapeutic styles resonate with you? (Select up to 3)",
    type: "multi",
    options: [
      "Structured Guide - Evidence-based and goal-oriented",
      "Compassionate Friend - Warm and emotionally supportive",
      "Motivational Coach - Direct and accountability-driven",
      "Mindfulness Mentor - Calm and present-focused",
      "Creative Explorer - Uses art and metaphors",
      "Cultural Advocate - Focused on identity and empowerment",
    ],
  },
  {
    id: 3,
    title: "How would you like me to communicate with you?",
    type: "single",
    options: [
      "Warm & Nurturing - Gentle and patient",
      "Professional & Clear - Clinical terminology",
      "Casual & Humorous - Like a friend",
      "Direct & Concise - Straight to solutions",
      "Motivational - Affirming and growth-focused",
    ],
  },
  {
    id: 4,
    title:
      "Any diagnoses, medications, or mental health history I should know about?",
    type: "text",
    placeholder:
      "E.g. 'Diagnosed with anxiety in 2020', 'Taking antidepressants'...",
  },
  {
    id: 5,
    title: "How do you identify? (Gender, race, culture, pronouns, etc.)",
    type: "text",
    placeholder: "E.g. 'Queer, Latino, female,  he/him  ' (Optional)",
  },
  {
    id: 6,
    title: "What does your support system look like right now?",
    type: "single",
    options: [
      "I have strong support (friends/family/therapist)",
      "I'm somewhat isolated but managing",
      "I lack support right now",
      "Prefer not to answer",
    ],
  },
  {
    id: 7,
    title: "Are you currently in crisis or needing immediate safety planning?",
    type: "single",
    options: [
      "No, I'm safe",
      "I'm struggling but not in danger",
      "Yes, I need resources now",
    ],
  },
];

type Answers = {
  [key: number]: string | string[];
};

const IntakeQuestionnaire = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showCrisisResources, setShowCrisisResources] = useState(false);

  const handleAnswer = (answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex + 1]: answer,
    }));
  };

  const handleNext = () => {
    // Check if current question is the crisis question and user needs help
    if (
      currentQuestionIndex === 6 &&
      answers[7] === "Yes, I need resources now"
    ) {
      setShowCrisisResources(true);
      return;
    }

    if (currentQuestionIndex < INTAKE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit all answers
      router.push("/(tabs)/Dashboard");
      // TODO: Send to your backend
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkip = () => {
    handleAnswer(""); // Set empty answer for skipped question
    handleNext();
  };

  const currentQuestion = INTAKE_QUESTIONS[currentQuestionIndex];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {INTAKE_QUESTIONS.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    ((currentQuestionIndex + 1) / INTAKE_QUESTIONS.length) * 100
                  }%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Current Question */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>{currentQuestion.title}</Text>

            {currentQuestion.type === "single" && (
              <View style={styles.optionsContainer}>
                {currentQuestion.options?.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      answers[currentQuestion.id] === option &&
                        styles.selectedOption,
                    ]}
                    onPress={() => handleAnswer(option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {currentQuestion.type === "multi" && (
              <View style={styles.optionsContainer}>
                {currentQuestion.options?.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      (
                        (answers[currentQuestion.id] as string[]) || []
                      ).includes(option) && styles.selectedOption,
                    ]}
                    onPress={() => {
                      const currentAnswers =
                        (answers[currentQuestion.id] as string[]) || [];
                      const newAnswers = currentAnswers.includes(option)
                        ? currentAnswers.filter((a) => a !== option)
                        : currentAnswers.length < 3
                        ? [...currentAnswers, option]
                        : currentAnswers;
                      handleAnswer(newAnswers);
                    }}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                    {((answers[currentQuestion.id] as string[]) || []).includes(
                      option
                    ) && <Text style={styles.selectedIndicator}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {currentQuestion.type === "text" && (
              <TextInput
                style={styles.textInput}
                multiline
                placeholder={currentQuestion.placeholder}
                value={(answers[currentQuestion.id] as string) || ""}
                onChangeText={(text) => handleAnswer(text)}
                blurOnSubmit={false}
                onSubmitEditing={Keyboard.dismiss}
              />
            )}
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentQuestionIndex > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}

          {currentQuestion.type === "text" && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.nextButton,
              !answers[currentQuestion.id] && styles.disabledButton,
            ]}
            onPress={handleNext}
            disabled={!answers[currentQuestion.id]}
          >
            <Text style={styles.buttonText}>
              {currentQuestionIndex === INTAKE_QUESTIONS.length - 1
                ? "Submit"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Crisis Resources Modal */}
        <Modal
          visible={showCrisisResources}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.crisisContainer}>
            <Text style={styles.crisisTitle}>Immediate Help Resources</Text>
            <ScrollView>
              <Text style={styles.crisisText}>
                You're not alone. Here are resources that can help right now:
              </Text>

              <Text style={styles.resourceItem}>
                • National Suicide Prevention Lifeline: 988
              </Text>
              <Text style={styles.resourceItem}>
                • Crisis Text Line: Text HOME to 741741
              </Text>
              <Text style={styles.resourceItem}>
                • Emergency Services: 911 or nearest ER
              </Text>

              <Text style={styles.crisisText}>
                Your safety is our top priority. Please reach out to one of
                these resources.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.crisisButton}
              onPress={() => setShowCrisisResources(false)}
            >
              <Text style={styles.buttonText}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4a90e2",
    borderRadius: 4,
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 30,
    color: "#333",
    lineHeight: 30,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#e3f2fd",
    borderColor: "#4a90e2",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedIndicator: {
    color: "#4a90e2",
    fontWeight: "bold",
    fontSize: 18,
  },
  textInput: {
    minHeight: 120,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  nextButton: {
    padding: 15,
    backgroundColor: "#4a90e2",
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#a0c4ff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  crisisContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  crisisTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 20,
    textAlign: "center",
  },
  crisisText: {
    fontSize: 18,
    marginVertical: 15,
    lineHeight: 26,
    color: "#333",
  },
  resourceItem: {
    fontSize: 16,
    marginVertical: 10,
    paddingLeft: 20,
    color: "#d32f2f",
    fontWeight: "500",
  },
  crisisButton: {
    padding: 15,
    backgroundColor: "#d32f2f",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default IntakeQuestionnaire;
