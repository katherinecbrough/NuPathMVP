import React from "react";
import { View, Text, StyleSheet } from "react-native";

type ProgressBarProps = {
  value: number; // Percentage value between 0-100
  color: string; // Color string (hex, rgb, or named color)
};

const ProgressBar: React.FC<ProgressBarProps> = ({ value, color }) => (
  <View style={styles.progressBarContainer}>
    <View
      style={[
        styles.progressBar,
        {
          width: `${Math.min(100, Math.max(0, value))}%`,
          backgroundColor: color,
        },
      ]}
    />
    <Text style={styles.progressText}>{value}%</Text>
  </View>
);

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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

export default ProgressBar;
