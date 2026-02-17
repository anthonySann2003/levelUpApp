import React from "react";
import { StyleSheet, Text, View } from "react-native";

type XPBarProps = {
  current: number;
  max: number;
};

export default function XPBar({ current, max }: XPBarProps) {
  // Prevent overflow and negative values
  const safeCurrent = Math.max(0, Math.min(current, max));
  const percentage = (safeCurrent / max) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* Background Bar */}
        <View style={styles.barBackground}>
          {/* Filled Portion */}
          <View
            style={[
              styles.barFill,
              { width: `${percentage}%` },
            ]}
          />
        </View>

        {/* XP Text */}
        <Text style={styles.xpText}>
          {safeCurrent} / {max} XP
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: "center",
  },

  wrapper: {
    width: "80%",
    alignItems: "center",
  },

  barBackground: {
    width: "100%",
    height: 20,
    backgroundColor: "#1f2937", // dark gray
    borderRadius: 10,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: "#facc15", // gold
  },

  xpText: {
    marginTop: 6,
    fontSize: 14,
    color: "#9ca3af", // same gray as subtitles
    textAlign: "center",
    width: "100%",
    letterSpacing: 1,
  },
});
