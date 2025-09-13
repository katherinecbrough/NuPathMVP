import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
type Todo = {
  id: string;
  text: string;
  category: "work" | "exercise" | "socialization" | "hobbies";
  completed: boolean;
};
type Nutrition = {
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  water: number; // in glasses
};
type JournalEntry = {
  date: string;
  metrics: Metrics;
};
type ExerciseActivity = {
  type: "cardio" | "strength" | "flexibility" | "sports" | "other";
  duration: number;
  description: string;
};
type Metrics = {
  exercise: number;
  exerciseActivities: ExerciseActivity[];
  sleep: number;
  sunlight: number;
  mindfulness: number;
  meals: string[];
  mealTypes: ("homemade" | "takeout")[];
  vitamins: string[];
  nutrition: Nutrition;
  tasksCompleted: number;
  totalTasks: number;
  workCompleted: string;
  socialization: string;
  hobbies: string;
};
type Averages = {
  avgExercise: number;
  avgSleep: number;
  avgSunlight: number;
  avgProtein: number;
  avgCarbs: number;
  avgFats: number;
  avgFiber: number;
  avgWater: number;
  taskCompletionRate: number;
  mindfulnessConsistency: number;
};
const DailyActivityScreen = () => {
  // State for todos
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Morning walk", category: "exercise", completed: false },
    {
      id: "2",
      text: "Finish project report",
      category: "work",
      completed: false,
    },
    { id: "3", text: "Call mom", category: "socialization", completed: true },
  ]);
  const [pastEntries, setPastEntries] = useState<JournalEntry[]>([
    {
      date: "2023-05-01",
      metrics: {
        exercise: 45,
        exerciseActivities: [
          { type: "cardio", duration: 30, description: "Morning run" },
          { type: "strength", duration: 15, description: "Weight training" },
        ],
        sleep: 7.5,
        sunlight: 2,
        mindfulness: 20,
        vitamins: ["D 50 mg", "C", "Magnesium"],
        meals: ["Oatmeal", "Salad", "Fish"],
        mealTypes: ["homemade", "homemade", "homemade"],
        nutrition: {
          protein: 140,
          carbs: 180,
          fats: 60,
          fiber: 30,
          water: 8,
        },
        tasksCompleted: 4,
        totalTasks: 5,
        workCompleted: "Project outline",
        socialization: "Called mom",
        hobbies: "Played guitar",
      },
    },
  ]);

  // State for daily summary modal
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  //todo
  const [showAddTodoModal, setShowAddTodoModal] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showTotalModal, setShowTotalModal] = useState(false);
  const [newTodoCategory, setNewTodoCategory] =
    useState<Todo["category"]>("work");

  const [metrics, setMetrics] = useState<Metrics>({
    exercise: 30,
    exerciseActivities: [
      { type: "cardio", duration: 20, description: "Morning run" },
    ],
    sleep: 7,
    sunlight: 2,
    mindfulness: 15,
    vitamins: ["D", "C"],
    meals: ["Oatmeal", "Salad", "Chicken stir-fry"],
    mealTypes: ["homemade", "homemade", "homemade"],
    nutrition: {
      protein: 120,
      carbs: 200,
      fats: 50,
      fiber: 25,
      water: 6,
    },
    tasksCompleted: 2,
    totalTasks: 4,
    workCompleted: "Finished report",
    socialization: "Met with friends",
    hobbies: "Reading",
  });

  // Goals state
  const [goals, setGoals] = useState([
    { id: "1", text: "Exercise 30 mins daily", progress: 4, target: 7 },
    { id: "2", text: "8 hours sleep", progress: 5, target: 7 },
  ]);

  // Toggle todo completion
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  const addTodo = () => {
    if (newTodoText.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: newTodoText,
          category: newTodoCategory,
          completed: false,
        },
      ]);
      setNewTodoText("");
      setShowAddTodoModal(false);
    }
  };

  // Add new goal
  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([
        ...goals,
        {
          id: Date.now().toString(),
          text: newGoal,
          progress: 0,
          target: 7, // Default to weekly goal
        },
      ]);
      setNewGoal("");
      setShowGoalModal(false);
    }
  };
  const calculateAverages = (): Averages => {
    const allEntries = [...pastEntries, { date: "Today", metrics }];
    const count = allEntries.length;

    const totals = allEntries.reduce(
      (acc, entry) => ({
        exercise: acc.exercise + entry.metrics.exercise,
        sleep: acc.sleep + entry.metrics.sleep,
        sunlight: acc.sunlight + entry.metrics.sunlight,
        protein: acc.protein + entry.metrics.nutrition.protein,
        carbs: acc.carbs + entry.metrics.nutrition.carbs,
        fats: acc.fats + entry.metrics.nutrition.fats,
        fiber: acc.fiber + entry.metrics.nutrition.fiber,
        water: acc.water + entry.metrics.nutrition.water,
        mindfulnessDays:
          acc.mindfulnessDays + (entry.metrics.mindfulness >= 10 ? 1 : 0),
        tasksCompleted: acc.tasksCompleted + entry.metrics.tasksCompleted,
        totalTasks: acc.totalTasks + entry.metrics.totalTasks,
      }),
      {
        exercise: 0,
        sleep: 0,
        sunlight: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        water: 0,
        mindfulnessDays: 0,
        tasksCompleted: 0,
        totalTasks: 0,
      }
    );

    return {
      avgExercise: totals.exercise / count,
      avgSleep: totals.sleep / count,
      avgSunlight: totals.sunlight / count,
      avgProtein: totals.protein / count,
      avgCarbs: totals.carbs / count,
      avgFats: totals.fats / count,
      avgFiber: totals.fiber / count,
      avgWater: totals.water / count,
      taskCompletionRate: (totals.tasksCompleted / totals.totalTasks) * 100,
      mindfulnessConsistency: (totals.mindfulnessDays / count) * 100,
    };
  };
  // Calculate wellness score
  const calculateWellnessScore = () => {
    // Ensure all values are numbers
    const exercise =
      typeof metrics.exercise === "number" ? metrics.exercise : 0;
    const sleep = typeof metrics.sleep === "number" ? metrics.sleep : 0;
    const sunlight =
      typeof metrics.sunlight === "number" ? metrics.sunlight : 0;
    const mindfulness =
      typeof metrics.mindfulness === "number" ? metrics.mindfulness : 0;

    let score = 0;
    if (exercise >= 30) score += 20;
    if (sleep >= 7) score += 20;
    if (sunlight >= 1) score += 10;
    if (metrics.vitamins) score += 10;
    if (mindfulness >= 10) score += 20;

    const completedTodos = todos.filter((t) => t.completed).length;
    score += (completedTodos / todos.length) * 20 || 0;

    return Math.min(100, Math.round(score)).toFixed(1);
  };
  const averages = calculateAverages();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header with all buttons */}
        <View style={styles.header}>
          <Text style={styles.title}>Daily Activity</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.goalButton}
              onPress={() => setShowAddTodoModal(true)}
            >
              <Text style={styles.buttonText}>+ Add Todo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.summaryButton}
              onPress={() => setShowSummaryModal(true)}
            >
              <Text style={styles.buttonText}>End of Day</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.goalButton}
              onPress={() => setShowGoalModal(true)}
            >
              <Text style={styles.buttonText}>Add Goal</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.synopsisButtons}>
            <TouchableOpacity
              style={styles.dailyButton}
              onPress={() => setShowDailyModal(true)}
            >
              <Text style={styles.buttonText}>Daily Synopsis</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.totalButton}
              onPress={() => setShowTotalModal(true)}
            >
              <Text style={styles.buttonText}>Total Synopsis</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wellness Overview */}
        <View style={styles.wellnessCard}>
          <Text style={styles.cardTitle}>Today's Wellness</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{metrics.exercise} min</Text>
              <Text style={styles.metricLabel}>Exercise</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{metrics.sleep} hrs</Text>
              <Text style={styles.metricLabel}>Sleep</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{metrics.sunlight} hrs</Text>
              <Text style={styles.metricLabel}>Sunlight</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{calculateWellnessScore()}</Text>
              <Text style={styles.metricLabel}>Wellness</Text>
            </View>
          </View>
        </View>

        {/* Todo List */}
        <ScrollView style={styles.todoContainer}>
          {["work", "exercise", "socialization", "hobbies"].map((category) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              {todos
                .filter((todo) => todo.category === category)
                .map((todo) => (
                  <TouchableOpacity
                    key={todo.id}
                    style={styles.todoItem}
                    onPress={() => toggleTodo(todo.id)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        todo.completed && styles.checkboxCompleted,
                      ]}
                    >
                      {todo.completed && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.todoText,
                        todo.completed && styles.todoCompleted,
                      ]}
                    >
                      {todo.text}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          ))}
        </ScrollView>

        {/* Goals Section */}
        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          {goals.map((goal) => (
            <View key={goal.id} style={styles.goalItem}>
              <Text style={styles.goalText}>{goal.text}</Text>
              <Text style={styles.goalProgress}>
                {goal.progress}/{goal.target} days
              </Text>
            </View>
          ))}
        </View>
        {/* Daily Synopsis Modal */}
        <Modal visible={showDailyModal} animationType="slide" transparent>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Today's Wellness Report</Text>

              <ScrollView>
                {/* Sleep Analysis - Hardcoded values */}
                <View style={styles.synopsisSection}>
                  <Text style={styles.synopsisHeader}>
                    🌙 Sleep Performance
                  </Text>
                  <Text>- Duration: 7.2 hours (within ideal range)</Text>
                  <Text>- Consistency: Fell asleep within 15m of target</Text>
                  <Text>
                    - Recommendation: Try reducing screen time after 9pm
                  </Text>
                </View>

                {/* Nutrition - Hardcoded values */}
                <View style={styles.synopsisSection}>
                  <Text style={styles.synopsisHeader}>🍽️ Nutrition Intake</Text>
                  <Text>- Protein: 110g (exceeded daily target)</Text>
                  <Text>- Vegetables: Low intake (could increase)</Text>
                  <Text>- Observation: Carbs spiked at lunchtime</Text>
                  <Text>- Suggestion: Add leafy greens to dinner</Text>
                </View>
                <View style={styles.synopsisSection}>
                  <Text style={styles.synopsisHeader}>🏋️ Daily Movement</Text>
                  <Text>- Exercise: 35 minutes (met 80% of goal)</Text>
                  <Text>- Steps: 8,742 (4.3 miles)</Text>
                  <Text>- Observation: Most active between 7-8am</Text>
                  <Text>- Highlight: Exceeded cardio target by 10 mins</Text>
                  <Text>
                    - Suggestion: Add 5 mins of stretching post-workout
                  </Text>
                </View>

                {/* Activity - Hardcoded values */}
                <View style={styles.synopsisCard}>
                  <Text style={styles.cardHeader}>🏃 Activity</Text>
                  <Text>Exercise: 35 minutes</Text>
                  <Text>Steps: 8,542</Text>
                  <Text>Sunlight: 1.5 hours</Text>
                  <Text style={styles.positiveFeedback}>
                    ✓ Met exercise goal!
                  </Text>
                  <Text style={styles.suggestion}>
                    → Try a 10min walk after lunch
                  </Text>
                </View>

                {/* Productivity - Hardcoded values */}
                <View style={styles.synopsisSection}>
                  <Text style={styles.synopsisHeader}>📊 Task Completion</Text>
                  <Text>- Completed: 5/6 priority tasks</Text>
                  <Text>- Peak productivity: 9-11am</Text>
                  <Text>- Insight: Distractions increased after lunch</Text>
                  <Text>- Tip: Schedule creative work for mornings</Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDailyModal(false)}
              >
                <Text style={styles.closeButtonText}>Got it!</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
        {/* Total Synopsis Modal */}
        <Modal visible={showTotalModal} animationType="slide" transparent>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Your 30-Day Trends</Text>

              <ScrollView>
                {/* Sleep Trends - Hardcoded */}
                <View style={styles.synopsisSection}>
                  <Text style={styles.synopsisHeader}>⏳ Sleep Trends</Text>
                  <Text>- Average: 6.9 hours/night (aim for 7.5+)</Text>
                  <Text>- Pattern: Most restful on weekends</Text>
                  <Text>
                    - Finding: 25% harder to fall asleep after late work
                  </Text>
                  <Text>- Action Item: Set a consistent bedtime alarm</Text>
                </View>
                <View style={styles.synopsisSection}>
                  <Text style={styles.synopsisHeader}>
                    📅 30-Day Activity Trends
                  </Text>
                  <Text>- Avg exercise: 28 mins/day (improving ↗)</Text>
                  <Text>- Consistency: 5/7 days meet targets</Text>
                  <Text>- Pattern: Most consistent on MWF mornings</Text>
                  <Text>- Finding: 15% more active with workout buddy</Text>
                  <Text>
                    - Recommendation: Schedule 2 partner sessions/week
                  </Text>
                </View>

                {/* Nutrition Trends - Hardcoded */}
                <View style={styles.synopsisSection}>
                  <Text style={styles.synopsisHeader}>📉 Nutrition Trends</Text>
                  <Text>- Protein: Consistently meets targets</Text>
                  <Text>- Vegetables: Lowest intake on Mondays</Text>
                  <Text>- Correlation: Better focus on high-protein days</Text>
                  <Text>- Recommendation: Prep veggie snacks Sundays</Text>
                </View>

                {/* Activity Trends - Hardcoded */}
                <View style={styles.synopsisSection}>
                  <Text style={styles.synopsisHeader}>
                    📈 Efficiency Insights
                  </Text>
                  <Text>- Task completion: 72% weekly average</Text>
                  <Text>- Best time: Tuesday mornings (91% completion)</Text>
                  <Text>
                    - Discovery: 40% more productive after outdoor breaks
                  </Text>
                  <Text>- Strategy: Try the 50/10 work/break ratio</Text>
                </View>

                {/* Recommendations - Hardcoded */}
                <View style={styles.synopsisCard}>
                  <Text style={styles.cardHeader}>
                    💡 Recommended Adjustments
                  </Text>
                  <Text>• Add 15min to morning sunlight</Text>
                  <Text>• Try meal prepping on Sundays</Text>
                  <Text>• Schedule deep work before lunch</Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTotalModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Add Todo Modal */}
        <Modal visible={showAddTodoModal} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Todo</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter todo text"
                value={newTodoText}
                onChangeText={setNewTodoText}
              />

              <Text style={styles.label}>Category:</Text>
              <View style={styles.categoryOptions}>
                {(
                  [
                    "work",
                    "exercise",
                    "socialization",
                    "hobbies",
                  ] as Todo["category"][]
                ).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      newTodoCategory === category && styles.selectedCategory,
                    ]}
                    onPress={() => setNewTodoCategory(category)}
                  >
                    <Text style={styles.categoryOptionText}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.modalButton} onPress={addTodo}>
                <Text style={styles.modalButtonText}>Add Todo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddTodoModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* End of Day Summary Modal */}
        <Modal visible={showSummaryModal} animationType="slide" transparent>
          <SafeAreaView style={styles.modalContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <View style={styles.modalContent}>
                <Text style={[styles.modalTitle, { marginTop: 20 }]}>
                  Daily Summary
                </Text>
                <View style={styles.modalScrollContainer}>
                  <ScrollView keyboardShouldPersistTaps="handled">
                    {/* Sleep Section */}
                    <View style={styles.summarySection}>
                      <Text style={styles.sectionHeader}>🌙 Sleep</Text>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Hours of Sleep</Text>
                        <TextInput
                          style={styles.summaryInput}
                          value={String(metrics.sleep)}
                          onChangeText={(text) =>
                            setMetrics({
                              ...metrics,
                              sleep: Number(text) || 0,
                            })
                          }
                          placeholder="Enter hours"
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>
                          Sleep Quality (1-10)
                        </Text>
                        <TextInput
                          style={styles.summaryInput}
                          placeholder="Rate your sleep"
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    {/* Exercise Section */}
                    <View style={styles.summarySection}>
                      <Text style={styles.sectionHeader}>🏃 Exercise</Text>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>
                          Total Exercise Duration (minutes)
                        </Text>
                        <TextInput
                          style={styles.summaryInput}
                          value={String(metrics.exercise)}
                          onChangeText={(text) =>
                            setMetrics({
                              ...metrics,
                              exercise: Number(text) || 0,
                            })
                          }
                          placeholder="Enter minutes"
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.exerciseActivitiesContainer}>
                        {metrics.exerciseActivities.map((activity, index) => (
                          <View key={index} style={styles.exerciseActivityItem}>
                            <View style={styles.exerciseTypeContainer}>
                              <Text style={styles.exerciseLabel}>
                                Activity {index + 1}
                              </Text>
                              <View style={styles.exerciseTypeButtons}>
                                {(
                                  [
                                    "cardio",
                                    "strength",
                                    "flexibility",
                                    "sports",
                                    "other",
                                  ] as const
                                ).map((type) => (
                                  <TouchableOpacity
                                    key={type}
                                    style={[
                                      styles.exerciseTypeButton,
                                      activity.type === type &&
                                        styles.exerciseTypeButtonSelected,
                                    ]}
                                    onPress={() => {
                                      const newActivities = [
                                        ...metrics.exerciseActivities,
                                      ];
                                      newActivities[index] = {
                                        ...activity,
                                        type,
                                      };
                                      setMetrics({
                                        ...metrics,
                                        exerciseActivities: newActivities,
                                      });
                                    }}
                                  >
                                    <Text
                                      style={[
                                        styles.exerciseTypeText,
                                        activity.type === type &&
                                          styles.exerciseTypeTextSelected,
                                      ]}
                                    >
                                      {type.charAt(0).toUpperCase() +
                                        type.slice(1)}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            </View>
                            <View style={styles.exerciseDetailsContainer}>
                              <TextInput
                                style={[styles.exerciseInput, { flex: 2 }]}
                                value={activity.description}
                                onChangeText={(text) => {
                                  const newActivities = [
                                    ...metrics.exerciseActivities,
                                  ];
                                  newActivities[index] = {
                                    ...activity,
                                    description: text,
                                  };
                                  setMetrics({
                                    ...metrics,
                                    exerciseActivities: newActivities,
                                  });
                                }}
                                placeholder="What did you do?"
                              />
                              <TextInput
                                style={[styles.exerciseInput, { flex: 1 }]}
                                value={String(activity.duration)}
                                onChangeText={(text) => {
                                  const newActivities = [
                                    ...metrics.exerciseActivities,
                                  ];
                                  newActivities[index] = {
                                    ...activity,
                                    duration: Number(text) || 0,
                                  };
                                  setMetrics({
                                    ...metrics,
                                    exerciseActivities: newActivities,
                                  });
                                }}
                                placeholder="Mins"
                                keyboardType="numeric"
                              />
                            </View>
                          </View>
                        ))}
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => {
                            setMetrics({
                              ...metrics,
                              exerciseActivities: [
                                ...metrics.exerciseActivities,
                                {
                                  type: "cardio",
                                  duration: 0,
                                  description: "",
                                },
                              ],
                            });
                          }}
                        >
                          <Text style={styles.addButtonText}>
                            + Add Exercise Activity
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Nutrition Section */}
                    <View style={styles.summarySection}>
                      <Text style={styles.sectionHeader}>🍽️ Nutrition</Text>
                      <View style={styles.mealContainer}>
                        {metrics.meals.map((meal, index) => (
                          <View key={index} style={styles.mealItem}>
                            <Text style={styles.mealLabel}>
                              Meal {index + 1}
                            </Text>
                            <TextInput
                              style={styles.mealInput}
                              value={meal}
                              onChangeText={(text) => {
                                const newMeals = [...metrics.meals];
                                newMeals[index] = text;
                                setMetrics({
                                  ...metrics,
                                  meals: newMeals,
                                });
                              }}
                              placeholder="What did you eat?"
                            />
                            <View style={styles.mealTypeContainer}>
                              <TouchableOpacity
                                style={[
                                  styles.mealTypeButton,
                                  metrics.mealTypes?.[index] === "homemade" &&
                                    styles.mealTypeButtonSelected,
                                ]}
                                onPress={() => {
                                  const newMealTypes = [
                                    ...(metrics.mealTypes || []),
                                  ];
                                  newMealTypes[index] = "homemade";
                                  setMetrics({
                                    ...metrics,
                                    mealTypes: newMealTypes,
                                  });
                                }}
                              >
                                <Text
                                  style={[
                                    styles.mealTypeText,
                                    metrics.mealTypes?.[index] === "homemade" &&
                                      styles.mealTypeTextSelected,
                                  ]}
                                >
                                  Homemade
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  styles.mealTypeButton,
                                  metrics.mealTypes?.[index] === "takeout" &&
                                    styles.mealTypeButtonSelected,
                                ]}
                                onPress={() => {
                                  const newMealTypes = [
                                    ...(metrics.mealTypes || []),
                                  ];
                                  newMealTypes[index] = "takeout";
                                  setMetrics({
                                    ...metrics,
                                    mealTypes: newMealTypes,
                                  });
                                }}
                              >
                                <Text
                                  style={[
                                    styles.mealTypeText,
                                    metrics.mealTypes?.[index] === "takeout" &&
                                      styles.mealTypeTextSelected,
                                  ]}
                                >
                                  Takeout
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                        <TouchableOpacity style={styles.addButton}>
                          <Text style={styles.addButtonText}>+ Add Meal</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.nutritionGrid}>
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>
                            Water (glasses)
                          </Text>
                          <TextInput
                            style={styles.nutritionInput}
                            value={String(metrics.nutrition.water)}
                            onChangeText={(text) =>
                              setMetrics({
                                ...metrics,
                                nutrition: {
                                  ...metrics.nutrition,
                                  water: Number(text) || 0,
                                },
                              })
                            }
                            keyboardType="numeric"
                            placeholder="0"
                          />
                        </View>
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Protein (g)</Text>
                          <TextInput
                            style={styles.nutritionInput}
                            value={String(metrics.nutrition.protein)}
                            onChangeText={(text) =>
                              setMetrics({
                                ...metrics,
                                nutrition: {
                                  ...metrics.nutrition,
                                  protein: Number(text) || 0,
                                },
                              })
                            }
                            keyboardType="numeric"
                            placeholder="0"
                          />
                        </View>
                      </View>
                    </View>

                    {/* Mindfulness Section */}
                    <View style={styles.summarySection}>
                      <Text style={styles.sectionHeader}>🧘 Mindfulness</Text>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>
                          Meditation Duration (minutes)
                        </Text>
                        <TextInput
                          style={styles.summaryInput}
                          value={String(metrics.mindfulness)}
                          onChangeText={(text) =>
                            setMetrics({
                              ...metrics,
                              mindfulness: Number(text) || 0,
                            })
                          }
                          placeholder="Enter minutes"
                          keyboardType="numeric"
                        />
                      </View>
                      <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addButtonText}>
                          + Add Mindfulness Activity
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Social & Hobbies Section */}
                    <View style={styles.summarySection}>
                      <Text style={styles.sectionHeader}>
                        👥 Social & Hobbies
                      </Text>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>
                          Social Activities
                        </Text>
                        <TextInput
                          style={styles.summaryInput}
                          value={metrics.socialization}
                          onChangeText={(text) =>
                            setMetrics({
                              ...metrics,
                              socialization: text,
                            })
                          }
                          placeholder="What social activities did you do?"
                        />
                      </View>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>
                          Hobbies & Recreation
                        </Text>
                        <TextInput
                          style={styles.summaryInput}
                          value={metrics.hobbies}
                          onChangeText={(text) =>
                            setMetrics({
                              ...metrics,
                              hobbies: text,
                            })
                          }
                          placeholder="What hobbies did you enjoy?"
                        />
                      </View>
                    </View>
                  </ScrollView>
                </View>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowSummaryModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Save Summary</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>

        {/* Add Goal Modal */}
        <Modal visible={showGoalModal} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Goal</Text>

              {/* Goal Text Input */}
              <TextInput
                style={styles.input}
                placeholder="Enter your goal (e.g., 'Exercise daily')"
                value={newGoal}
                onChangeText={setNewGoal}
              />

              {/* Goal Type Dropdown */}
              <Text style={styles.label}>Goal Type:</Text>
              <View style={styles.categoryOptions}>
                {[
                  "Exercise",
                  "Wellness",
                  "Sleep",
                  "Nutrition",
                  "Productivity",
                ].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.categoryOption,
                      styles.goalTypeOption, // New style for goal type options
                    ]}
                  >
                    <Text style={styles.categoryOptionText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Duration Picker */}
              <Text style={styles.label}>Duration:</Text>
              <View style={styles.durationContainer}>
                {["1 week", "2 weeks", "1 month", "3 months", "6 months"].map(
                  (duration) => (
                    <TouchableOpacity
                      key={duration}
                      style={[
                        styles.durationOption,
                        styles.categoryOption, // Reuse existing styles
                      ]}
                    >
                      <Text style={styles.categoryOptionText}>{duration}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              {/* Target Date Picker */}
              <Text style={styles.label}>Target Date:</Text>
              <TouchableOpacity style={styles.datePickerButton}>
                <Text style={styles.datePickerText}>Select Date</Text>
              </TouchableOpacity>

              {/* Action Buttons */}
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Add Goal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 15,
  },
  header: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: Colors.Primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  synopsisButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  dailyButton: {
    backgroundColor: Colors.Primary,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  totalButton: {
    backgroundColor: Colors.Primary,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  todoContainer: {
    flex: 1,
  },
  categorySection: {
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
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.Primary,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompleted: {
    backgroundColor: Colors.Primary,
  },
  checkmark: {
    color: "white",
    fontWeight: "bold",
  },
  todoText: {
    fontSize: 16,
    color: "#333",
  },
  todoCompleted: {
    textDecorationLine: "line-through",
    color: "#888",
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
    padding: 20,
    flex: 1,
    maxHeight: "90%",
  },
  modalScrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  modalButtonContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.Primary,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  categoryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  categoryOption: {
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  selectedCategory: {
    backgroundColor: Colors.Primary,
  },
  categoryOptionText: {
    color: "#333",
  },
  modalButton: {
    backgroundColor: Colors.Primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  synopsisCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 10,
  },
  goalTypeOption: {
    backgroundColor: "#e3f2fd", // Light blue background for goal types
    marginBottom: 8,
  },
  durationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  durationOption: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#f5f5f5", // Light gray for duration options
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  datePickerText: {
    color: Colors.Primary,
  },
  positiveFeedback: {
    color: "#2e7d32",
    marginTop: 8,
    fontWeight: "500",
  },
  suggestion: {
    color: "#d32f2f",
    marginTop: 5,
    fontStyle: "italic",
  },
  chartPlaceholder: {
    backgroundColor: "#f5f5f5",
    height: 100,
    marginTop: 10,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#999",
  },
  closeButton: {
    backgroundColor: Colors.Primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  summaryButton: {
    backgroundColor: Colors.SubPrimary,
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  goalButton: {
    backgroundColor: Colors.MainGreen,
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  wellnessCard: {
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
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 15,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metric: {
    alignItems: "center",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  metricLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  synopsisTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 15,
    textAlign: "center",
  },
  synopsisSection: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  synopsisHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  synopsisText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    lineHeight: 20,
  },
  insightText: {
    color: "#2e7d32",
    fontStyle: "italic",
    marginTop: 5,
  },
  goalsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 15,
  },
  goalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  goalText: {
    fontSize: 15,
    color: "#333",
  },
  goalProgress: {
    fontSize: 15,
    color: Colors.Primary,
    fontWeight: "bold",
  },
  summaryItem: {
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  summaryInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  goalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  summarySection: {
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 15,
  },
  mealContainer: {
    marginBottom: 15,
  },
  mealItem: {
    marginBottom: 10,
  },
  mealLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  mealInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  nutritionItem: {
    width: "48%",
    marginBottom: 10,
  },
  nutritionLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  nutritionInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  mealTypeContainer: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  mealTypeButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.Primary,
    alignItems: "center",
  },
  mealTypeButtonSelected: {
    backgroundColor: Colors.Primary,
  },
  mealTypeText: {
    color: Colors.Primary,
    fontSize: 14,
  },
  mealTypeTextSelected: {
    color: "white",
  },
  exerciseActivitiesContainer: {
    marginTop: 15,
  },
  exerciseActivityItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  exerciseTypeContainer: {
    marginBottom: 10,
  },
  exerciseLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  exerciseTypeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exerciseTypeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.Primary,
  },
  exerciseTypeButtonSelected: {
    backgroundColor: Colors.Primary,
  },
  exerciseTypeText: {
    color: Colors.Primary,
    fontSize: 12,
  },
  exerciseTypeTextSelected: {
    color: "white",
  },
  exerciseDetailsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  exerciseInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
  },
});

export default DailyActivityScreen;
