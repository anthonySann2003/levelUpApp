import { StyleSheet, Text, View } from "react-native";

export default function CharacterScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Quest Log</Text>
        <Text style={styles.subtitle}>0 / 6 QUESTS COMPLETED TODAY</Text>
      </View>

      <View style={styles.levelContainer}>
        <View style={styles.levelCircle}>
          <Text style={styles.levelLabel}>LEVEL</Text>
          <Text style={styles.levelNumber}>3</Text>
        </View>
      </View>

      {/* XP Bar */}
      <View style={styles.xpContainer}>
        <View style={styles.xpBarWrapper}>
          <View style={styles.xpBarBackground}>
            <View style={styles.xpBarFill} />
          </View>
          <Text style={styles.xpText}>200 / 500 XP</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000", // Black background
  },
  header: {
    paddingTop: 80, // pushes text down from top
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 6,
    letterSpacing: 1,
  },
  levelContainer: {
    alignItems: "center",
    marginTop: 30,
  },

  levelCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: "#facc15", // yellow gold
    justifyContent: "center",
    alignItems: "center",
  },

  levelLabel: {
    color: "#9ca3af",
    fontSize: 14,
    letterSpacing: 2,
  },

  levelNumber: {
    color: "#facc15",
    fontSize: 40,
    fontWeight: "700",
    marginTop: 4,
  },
  /* XP BAR STYLES */
  xpContainer: {
    marginTop: 24,
    alignItems: "center", // centers the wrapper
  },

  xpBarWrapper: {
    width: "80%", // bar + text together
    alignItems: "center",
  },

  xpBarBackground: {
    width: "100%",
    height: 20,
    backgroundColor: "#374151",
    borderRadius: 10,
    overflow: "hidden",
  },

  xpBarFill: {
    width: "40%", // 200 / 500
    height: "100%",
    backgroundColor: "#facc15",
  },

  xpText: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center", // centers text under bar
    width: "100%",
  },
});
