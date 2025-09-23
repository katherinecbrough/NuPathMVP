import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import ProgressBar from "./ProgressBar";
import { Colors } from "../../constants/Colors";
const FullSynopsisScreen = () => {
  // Detailed hardcoded data for prototype
  const wellnessData = {
    moodAnalysis: {
      averageScore: 7.2,
      trend: "11% improvement",
      dailyScores: [6, 7, 8, 7, 6, 8, 9],
      primaryMoodPatterns: ["Morning anxiety", "Evening calmness"],
    },
    anxietyInsights: {
      frequency: "3-4x/week",
      intensity: "Moderate (6/10 avg)",
      triggers: ["Work deadlines", "Social situations", "Uncertainty"],
      copingEffectiveness: "68% success rate",
    },
    wellnessProgress: {
      therapy: { value: 85, label: "Coaching" },
      mindfulness: { value: 62, label: "Mindfulness" },
      selfCare: { value: 75, label: "Self-Care" },
      social: { value: 68, label: "Social" },
    },
    selfLoveProgress: {
      selfCareConsistency: "75%",
      positiveAffirmations: "4/7 days",
      negativeSelfTalk: "Reduced by 40%",
      bodyPositivity: "Improving (5.8 → 7.1)",
    },
    mindfulnessMetrics: {
      presentMomentAwareness: "62%",
      distractionFrequency: "Every 12 mins avg",
      mindfulMinutes: "22/day",
      meditationConsistency: "5/7 days",
    },
    strengths: {
      therapyEngagement: {
        value: "92% attendance",
        detail: "Perfect attendance last 3 weeks",
      },
      exerciseRoutine: {
        value: "5.2 hrs/week",
        detail: "Exceeding 150min recommendation",
      },
      sleepHygiene: {
        value: "7.5 hrs/night",
        detail: "Consistent bedtime within 30min window",
      },
      socialConnections: {
        value: "4 meaningful interactions",
        detail: "Up from 2/week last month",
      },
    },
    growthAreas: {
      anxietyManagement: {
        severity: "High priority",
        detail: "Panic attacks 2x this month",
      },
      selfCriticism: {
        severity: "Moderate priority",
        detail: "3 negative self-talk episodes/day",
      },
      workLifeBalance: {
        severity: "Moderate priority",
        detail: "Working 10hrs/day avg",
      },
      nutrition: {
        severity: "Low priority",
        detail: "Only 2 vegetable servings/day",
      },
    },
    recommendations: [
      {
        category: "Anxiety",
        suggestions: [
          "Practice 4-7-8 breathing when anxious (current success: 60%)",
          "Schedule worry time (15min/day) to contain anxious thoughts",
        ],
      },
      {
        category: "Self-Love",
        suggestions: [
          "Mirror affirmations every morning (current: 2/7 days)",
          "Write 3 self-appreciations nightly",
        ],
      },
      {
        category: "Mindfulness",
        suggestions: [
          "Try body scan meditation before bed",
          "Set phone reminders for mindful breathing (every 2hrs)",
        ],
      },
    ],
  };
  // const ProgressBar = ({ value, color }) => (
  //   <View style={styles.progressBarContainer}>
  //     <View style={[styles.progressBar, { width: `${value}%`, backgroundColor: color }]} />
  //     <Text style={styles.progressText}>{value}%</Text>
  //   </View>
  // );
  // Chart data
  const progressChartData = {
    labels: ["Coaching", "Mindfulness", "Self-Care", "Social"],
    data: [0.85, 0.62, 0.75, 0.68],
    colors: [Colors.Primary, "#03dac6", "#ffc107", "#4caf50"],
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.header}>Your Complete Wellness Synopsis</Text>

          {/* Mood Analysis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mood Analysis 🌈</Text>
            <View style={styles.card}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Average Mood Score:</Text>
                <Text style={styles.metricValue}>
                  {wellnessData.moodAnalysis.averageScore}/10
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>30-Day Trend:</Text>
                <Text style={[styles.metricValue, styles.positiveTrend]}>
                  {wellnessData.moodAnalysis.trend} ↑
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Patterns:</Text>
                <Text style={styles.metricValue}>
                  {wellnessData.moodAnalysis.primaryMoodPatterns.join(", ")}
                </Text>
              </View>
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Weekly Mood Scores</Text>
                <View style={styles.dailyScoresContainer}>
                  {wellnessData.moodAnalysis.dailyScores.map((score, index) => (
                    <View key={index} style={styles.dailyScore}>
                      <Text style={styles.dayLabel}>
                        {["S", "M", "T", "W", "T", "F", "S"][index]}
                      </Text>
                      <View style={[styles.scoreBar, { height: score * 8 }]} />
                      <Text style={styles.scoreLabel}>{score}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Wellness Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wellness Progress</Text>
            <View style={styles.card}>
              {Object.values(wellnessData.wellnessProgress).map(
                (item, index) => (
                  <View key={index} style={styles.progressItem}>
                    <Text style={styles.progressLabel}>{item.label}</Text>
                    <ProgressBar value={item.value} color={Colors.Primary} />
                  </View>
                )
              )}
            </View>
          </View>

          {/* Anxiety Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Anxiety Breakdown 🌀</Text>
            <View style={styles.card}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Frequency:</Text>
                <Text style={styles.metricValue}>
                  {wellnessData.anxietyInsights.frequency}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Intensity:</Text>
                <Text style={styles.metricValue}>
                  {wellnessData.anxietyInsights.intensity}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Top Triggers:</Text>
                <View style={styles.tagsContainer}>
                  {wellnessData.anxietyInsights.triggers.map(
                    (trigger, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{trigger}</Text>
                      </View>
                    )
                  )}
                </View>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Coping Effectiveness:</Text>
                <Text style={styles.metricValue}>
                  {wellnessData.anxietyInsights.copingEffectiveness}
                </Text>
              </View>
            </View>
          </View>

          {/* Self-Love Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Self-Love Journey 💖</Text>
            <View style={styles.card}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Self-Care Consistency:</Text>
                <Text style={styles.metricValue}>
                  {wellnessData.selfLoveProgress.selfCareConsistency}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Positive Affirmations:</Text>
                <Text style={styles.metricValue}>
                  {wellnessData.selfLoveProgress.positiveAffirmations}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Negative Self-Talk:</Text>
                <Text style={[styles.metricValue, styles.positiveTrend]}>
                  {wellnessData.selfLoveProgress.negativeSelfTalk} reduction
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Body Positivity:</Text>
                <Text style={styles.metricValue}>
                  {wellnessData.selfLoveProgress.bodyPositivity} (1.3pt
                  improvement)
                </Text>
              </View>
            </View>
          </View>

          {/* Mindfulness Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mindfulness & Presence 🧘</Text>
            <View style={styles.card}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>
                  Present-Moment Awareness:
                </Text>
                <Text style={styles.metricValue}>
                  {wellnessData.mindfulnessMetrics.presentMomentAwareness}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Distraction Frequency:</Text>
                <Text style={styles.metricValue}>
                  {wellnessData.mindfulnessMetrics.distractionFrequency}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Daily Mindful Minutes:</Text>
                <Text style={styles.metricValue}>
                  {wellnessData.mindfulnessMetrics.mindfulMinutes}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Meditation Consistency:</Text>
                <Text style={styles.metricValue}>
                  {wellnessData.mindfulnessMetrics.meditationConsistency}
                </Text>
              </View>
            </View>
          </View>

          {/* Progress Chart
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wellness Progress Areas</Text>
            <View style={styles.chartCard}>
              <ProgressChart
                data={progressChartData}
                width={300}
                height={220}
                strokeWidth={12}
                radius={32}
                chartConfig={{
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                hideLegend={false}
              />
              <View style={styles.chartLegend}>
                {progressChartData.labels.map((label, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: progressChartData.colors[index] },
                      ]}
                    />
                    <Text style={styles.legendText}>
                      {label} ({Math.round(progressChartData.data[index] * 100)}
                      %)
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View> */}

          {/* Strengths Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Superpowers ✨</Text>
            {Object.entries(wellnessData.strengths).map(([key, strength]) => (
              <View key={key} style={styles.strengthCard}>
                <MaterialIcons name="star" size={20} color="#FFC107" />
                <View style={styles.strengthTextContainer}>
                  <Text style={styles.strengthTitle}>{strength.value}</Text>
                  <Text style={styles.strengthDetail}>{strength.detail}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Growth Areas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Growth Opportunities 🌱</Text>
            {Object.entries(wellnessData.growthAreas).map(([key, area]) => (
              <View key={key} style={styles.growthCard}>
                <MaterialIcons
                  name="warning"
                  size={20}
                  color={
                    area.severity === "High priority" ? "#F44336" : "#FF9800"
                  }
                />
                <View style={styles.growthTextContainer}>
                  <Text style={styles.growthTitle}>
                    {key.replace(/([A-Z])/g, " $1")}
                  </Text>
                  <Text style={styles.growthSeverity}>({area.severity})</Text>
                  <Text style={styles.growthDetail}>{area.detail}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Recommendations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Personalized Recommendations 🎯
            </Text>
            {wellnessData.recommendations.map((category, index) => (
              <View key={index} style={styles.recommendationCategory}>
                <Text style={styles.recommendationHeader}>
                  {category.category}
                </Text>
                {category.suggestions.map((suggestion, sIndex) => (
                  <View key={sIndex} style={styles.recommendationItem}>
                    <MaterialIcons
                      name="chevron-right"
                      size={16}
                      color={Colors.Primary}
                    />
                    <Text style={styles.recommendationText}>{suggestion}</Text>
                  </View>
                ))}
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 15,
    color: "#555",
    flex: 1,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
    flex: 1,
  },
  positiveTrend: {
    color: "#4CAF50",
  },
  chartContainer: {
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  dailyScoresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
    marginTop: 8,
  },
  dailyScore: {
    alignItems: "center",
    width: "12%",
  },
  dayLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  scoreBar: {
    width: 12,
    backgroundColor: Colors.Primary,
    borderRadius: 6,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "flex-end",
  },
  tag: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#333",
  },
  chartCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  strengthCard: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  strengthTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  strengthTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E7D32",
  },
  strengthDetail: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  growthCard: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  growthTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  growthTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#E65100",
    textTransform: "capitalize",
  },
  growthSeverity: {
    fontSize: 12,
    color: "#E65100",
    marginTop: 2,
  },
  growthDetail: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  recommendationCategory: {
    marginBottom: 16,
  },
  recommendationHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    backgroundColor: "#F3E5F5",
    padding: 8,
    borderRadius: 6,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingLeft: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  progressItem: {
    marginBottom: 15,
  },
  progressLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  progressText: {
    fontSize: 12,
    color: "#333",
  },
});

export default FullSynopsisScreen;
