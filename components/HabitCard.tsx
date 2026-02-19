import { Pressable, StyleSheet, Text, View } from "react-native";
import { Habit } from "../types";

interface Props {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export default function HabitCard({ habit, isCompleted, onToggle, onDelete }: Props) {
  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      
      {/* Icon and name */}
      <Text style={styles.icon}>{habit.icon}</Text>
      <Text style={styles.name}>{habit.name}</Text>

      {/* Description if it exists */}
      {habit.description && (
        <Text style={styles.description}>{habit.description}</Text>
      )}

      {/* Attribute and XP */}
      <Text style={styles.attribute}>{habit.attribute.join(', ')}</Text>
      <Text style={styles.xp}>+{habit.xpReward} XP</Text>

      {/* Completion checkbox */}
      <Pressable onPress={onToggle} style={[styles.circle, isCompleted && styles.circleCompleted]} />

      {/* Delete button */}
      <Pressable onPress={onDelete}>
        <Text style={styles.delete}>✕</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: "#111827",
    borderRadius: 16,
    alignItems: "center",
  },
  cardCompleted: {
    opacity: 0.5,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  name: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  description: {
    color: "#9ca3af",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 6,
  },
  attribute: {
    color: "#9ca3af",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  xp: {
    color: "#facc15",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#374151",
    marginBottom: 8,
  },
  circleCompleted: {
    backgroundColor: "#facc15",
    borderColor: "#facc15",
  },
  delete: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
});