import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useCharacterStore } from '../store/habitsStore';
import { Quest } from '../types';

export default function CharacterScreen() {

  //Adding variables from habit store
  const { level, currentXp, xpToNextLevel, completedQuests, completeQuest, attributes } = useCharacterStore();

  //Defining daily quests
  const quests: Quest[] = [
    { icon: "💪", title: "Morning Workout", reward: "+150 XP · STRENGTH", xpReward: 150, attribute: "STRENGTH" },
    { icon: "📚", title: "Read 30 Minutes", reward: "+75 XP · INTELLIGENCE", xpReward: 75, attribute: "INTELLIGENCE" },
    { icon: "🧘", title: "Meditate", reward: "+100 XP · FOCUS", xpReward: 100, attribute: "FOCUS" },
    { icon: "🧊", title: "Cold Shower", reward: "+50 XP · DISCIPLINE", xpReward: 50, attribute: "DISCIPLINE" },
    { icon: "🏃", title: "Run 5K", reward: "+350 XP · ENDURANCE", xpReward: 350, attribute: "ENDURANCE" },
    { icon: "🤸", title: "Stretch Routine", reward: "+50 XP · AGILITY", xpReward: 50, attribute: "AGILITY" },
  ];

  //Temporary function to delete data for testing purposes
  const clearData = async () => {
    await AsyncStorage.clear();
    useCharacterStore.setState({
      level: 1,
      currentXp: 0,
      completedQuests: [],
      attributes: {
        STRENGTH: 3,
        ENDURANCE: 3,
        DISCIPLINE: 3,
        FOCUS: 3,
        INTELLIGENCE: 3,
        AGILITY: 3,
      },
      habits: useCharacterStore.getState().habits.map(h => ({ ...h, completedDates: [] }))
    });
  };

  //For attribute section
  const renderAttribute = (
    icon: string,
    label: string,
    value: number,
    color: string
  ) => {
    const max = 30; // arbitrary max for skeleton
    const percentage = (value / max) * 100;
  
    return (
      <View style={styles.attributeItem} key={label}>
        <View style={styles.attributeHeader}>
          <View style={styles.attributeLeft}>
            <Text style={styles.attributeIcon}>{icon}</Text>
            <Text style={styles.attributeLabel}>{label}</Text>
          </View>
          <Text style={styles.attributeValue}>{value}</Text>
        </View>
  
        <View style={styles.attributeBarBackground}>
          <View
            style={[
              styles.attributeBarFill,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
    );
  };
  //end of attribute section

  const renderQuest = (quest: Quest) => {
    const isCompleted = completedQuests.includes(quest.title);
  
    const handleComplete = () => completeQuest(quest.title, quest.xpReward, quest.attribute);
  
    return (
      <View style={styles.questItem} key={quest.title}>
        <View style={styles.questLeft}>
          <Text style={styles.questIcon}>{quest.icon}</Text>
          <View>
            <Text style={[styles.questTitle, isCompleted && { color: "#9ca3af" }]}>{quest.title}</Text>
            <Text style={styles.questReward}>{quest.reward}</Text>
          </View>
        </View>
  
        <Pressable onPress={handleComplete}>
          <View style={[
            styles.questCircle,
            isCompleted && { backgroundColor: "#facc15", borderColor: "#facc15" }
          ]} />
        </Pressable>
      </View>
    );
  };
  return (
    //<View style={styles.screen}>
    <ScrollView style={styles.screen} 
      contentContainerStyle={styles.scrollContent} 
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Quest Log</Text>
        <Text style={styles.subtitle}>{completedQuests.length} / 6 QUESTS COMPLETED TODAY</Text>
      </View>

      <View style={styles.levelContainer}>
        <View style={styles.levelCircle}>
          <Text style={styles.levelLabel}>LEVEL</Text>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>
      </View>

      {/* XP Bar */}
      <View style={styles.xpContainer}>
        <View style={styles.xpBarWrapper}>
          <View style={styles.xpBarBackground}>
            <View style={[styles.xpBarFill, {width: `${(currentXp / xpToNextLevel) * 100}%`}]} /> 
          </View>
          <Text style={styles.xpText}> {currentXp} / {xpToNextLevel} XP</Text>
        </View>
      </View>

      {/* ATTRIBUTES SECTION */}
      <View style={styles.attributesContainer}>
        <Text style={styles.attributesTitle}>ATTRIBUTES</Text>

        {renderAttribute("⚔️", "STRENGTH", attributes.STRENGTH, "#ef4444")}
        {renderAttribute("🛡️", "ENDURANCE", attributes.ENDURANCE, "#f97316")}
        {renderAttribute("🧘", "DISCIPLINE", attributes.DISCIPLINE, "#a855f7")}
        {renderAttribute("🎯", "FOCUS", attributes.FOCUS, "#38bdf8")}
        {renderAttribute("📘", "INTELLIGENCE", attributes.INTELLIGENCE, "#34d399")}
        {renderAttribute("⚡", "AGILITY", attributes.AGILITY, "#eab308")}
      </View>

      {/* DAILY QUESTS SECTION */}
      <View style={styles.questsContainer}>
        <Text style={styles.questsTitle}>DAILY QUESTS</Text>
        {quests.map(q => renderQuest(q))}
      </View>


      <Pressable onPress={clearData}> 
        <Text style={{ color: 'red' }}>Reset</Text> 
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000", // Black background
  },
  scrollContent: {
    paddingBottom: 40,
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

  attributesContainer: {
    marginTop: 40,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "#111827",
    borderRadius: 16,
  },
  
  attributesTitle: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 20,
  },
  
  attributeItem: {
    marginBottom: 18,
  },
  
  attributeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  
  attributeLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  attributeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  
  attributeLabel: {
    color: "white",
    fontSize: 14,
    letterSpacing: 1,
  },
  
  attributeValue: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  
  attributeBarBackground: {
    height: 8,
    backgroundColor: "#1f2937",
    borderRadius: 4,
    overflow: "hidden",
  },
  
  attributeBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  
  /* DAILY QUESTS */
  questsContainer: {
    marginTop: 40,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "#111827",
    borderRadius: 16,
  },

  questsTitle: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 20,
  },

  questItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#0f172a",
    borderRadius: 12,
    marginBottom: 12,
  },

  questLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  questIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  questTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },

  questReward: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 2,
  },

  questCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#374151",
  },
});
