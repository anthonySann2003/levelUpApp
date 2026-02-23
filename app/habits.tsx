import { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import HabitCard from "../components/HabitCard";
import { useCharacterStore } from "../store/habitsStore";
import { Attribute } from "../types";
import { getTodayLocal } from '../utils/dateHelpers';

export default function HabitsScreen() {
  const { habits, toggleHabitComplete, deleteHabit, addHabit } = useCharacterStore(); //Deconstructing store variables
  const [today, setToday] = useState(getTodayLocal());

  //Checking for the date on set interval for updating streaks
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = getTodayLocal();
      if (newDate !== today) {
        setToday(newDate);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [today]);

  //Modal form state variables
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute>('STRENGTH');
  const [xpReward, setXpReward] = useState('100');

  //Handles submitting of modal form for adding a habit
  const handleAddHabit = () => {
    if (!name.trim() || !icon.trim()) return; // name and icon are required
  
    addHabit({
      name: name.trim(),
      description: description.trim() || undefined,
      icon: icon.trim(),
      frequency: 'daily',
      attribute: [selectedAttribute],
      xpReward: parseInt(xpReward) || 100,
    });
  
    // reset form
    setName('');
    setDescription('');
    setIcon('');
    setSelectedAttribute('STRENGTH');
    setXpReward('100');
    setModalVisible(false);
  };

  //Start of the UI layout code
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <Text style={styles.subtitle}>{habits.filter(h => h.completedDates.includes(today)).length} / {habits.length} COMPLETED TODAY</Text>
      </View>
        {/* Flatlist creates the grid where habit cards will sit */}
      <FlatList
        data={habits}
        keyExtractor={h => h.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            isCompleted={item.completedDates.includes(today)}
            onToggle={() => toggleHabitComplete(item.id, today)}
            onDelete={() => deleteHabit(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No habits yet.</Text>
            <Text style={styles.emptySubtext}>Add one to get started.</Text>
          </View>
        }
      />

      {/* Add habit button - will open modal for adding new habit in step 5 */}
      <Pressable style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Habit</Text>
      </Pressable>

        {/* Update your existing add button to this */}
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Habit</Text>
        </Pressable>

        {/* Add Habit Modal */}
        <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <Text style={styles.modalTitle}>New Habit</Text>

                {/* Name */}
                <Text style={styles.label}>Name *</Text>
                <TextInput
                style={styles.input}
                placeholder="e.g. Morning Run"
                placeholderTextColor="#6b7280"
                value={name}
                onChangeText={setName}
                />

                {/* Description */}
                <Text style={styles.label}>Description (optional)</Text>
                <TextInput
                style={styles.input}
                placeholder="e.g. Run at least 5km"
                placeholderTextColor="#6b7280"
                value={description}
                onChangeText={setDescription}
                />

                {/* Icon */}
                <Text style={styles.label}>Icon *</Text>
                <TextInput
                style={styles.input}
                placeholder="Paste an emoji e.g. 🏃"
                placeholderTextColor="#6b7280"
                value={icon}
                onChangeText={setIcon}
                />

                {/* Attribute selector */}
                <Text style={styles.label}>Attribute</Text>
                <View style={styles.attributeGrid}>
                {(['STRENGTH', 'ENDURANCE', 'DISCIPLINE', 'FOCUS', 'INTELLIGENCE', 'AGILITY'] as Attribute[]).map(attr => (
                    <Pressable
                    key={attr}
                    style={[styles.attributeChip, selectedAttribute === attr && styles.attributeChipSelected]}
                    onPress={() => setSelectedAttribute(attr)}
                    >
                    <Text style={[styles.attributeChipText, selectedAttribute === attr && styles.attributeChipTextSelected]}>
                        {attr}
                    </Text>
                    </Pressable>
                ))}
                </View>

                {/* XP Reward */}
                <Text style={styles.label}>XP Reward</Text>
                <TextInput
                style={styles.input}
                placeholder="100"
                placeholderTextColor="#6b7280"
                value={xpReward}
                onChangeText={setXpReward}
                keyboardType="numeric"
                />

                {/* Buttons */}
                <View style={styles.modalButtons}>
                <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.submitButton} onPress={handleAddHabit}>
                    <Text style={styles.submitButtonText}>Add Habit</Text>
                </Pressable>
                </View>

            </ScrollView>
            </View>
        </View>
        </Modal>

    </View>
  );
}

//Start of stylesheet, this is where color, design, padding, etc is selected
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingTop: 80,
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
  grid: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 6,
  },
  addButton: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    backgroundColor: "#facc15",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  addButtonText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#111827",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    color: "#9ca3af",
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#1f2937",
    color: "white",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  attributeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  attributeChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#1f2937",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  attributeChipSelected: {
    backgroundColor: "#facc15",
    borderColor: "#facc15",
  },
  attributeChipText: {
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  attributeChipTextSelected: {
    color: "#000000",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1f2937",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#9ca3af",
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#facc15",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#000000",
    fontWeight: "700",
  },
});