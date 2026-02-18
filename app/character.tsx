import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function CharacterScreen() {

  //Adding state variables
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [currentXp, setCurrentXp] = useState(0);
  const [level, setLevel] = useState(1);
  const xpToNextLevel = 500;

  //Loading saved data when the app opens
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem('character');
        if (saved) {
          const parsed = JSON.parse(saved);
          setLevel(parsed.level);
          setCurrentXp(parsed.currentXp);
          setCompletedQuests(parsed.completedQuests);
        }
      } catch (e) {
        console.log('Failed to load data', e);
      }
    };
    loadData();
  }, []); // empty array means this only runs once on mount

  //Saving data whenever the state changes (autosaves)
  useEffect(() => {
    const saveData = async () => {
      try {
        const data = JSON.stringify({ level, currentXp, completedQuests });
        await AsyncStorage.setItem('character', data);
      } catch (e) {
        console.log('Failed to save data', e);
      }
    };
    saveData();
  }, [level, currentXp, completedQuests]); // runs whenever any of these change

  //Temporary function to clear data for testing/debugging
  const clearData = async () => {
    await AsyncStorage.clear();
    setLevel(1);
    setCurrentXp(0);
    setCompletedQuests([]);
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

  const renderQuest = (icon: string, title: string, reward: string, xpReward: number) => {
    const isCompleted = completedQuests.includes(title);
  
    const handleComplete = () => {
      if (isCompleted) return; // can't un-complete for now
      setCompletedQuests([...completedQuests, title]);
      setCurrentXp(prev => Math.min(prev + xpReward, xpToNextLevel)); //handling a quest being completed and updating xp

      const newXp = currentXp + xpReward;
      if (newXp >= xpToNextLevel) { //If user levled up
        setLevel(prev => prev + 1);
        setCurrentXp(newXp - xpToNextLevel); //carry over remainder of xp
      }
      else{
        setCurrentXp(newXp) //No level just set xp to new amount
      }
    };
  
    return (
      <View style={styles.questItem} key={title}>
        <View style={styles.questLeft}>
          <Text style={styles.questIcon}>{icon}</Text>
          <View>
            <Text style={[styles.questTitle, isCompleted && { color: "#9ca3af" }]}>{title}</Text>
            <Text style={styles.questReward}>{reward}</Text>
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

        {renderAttribute("⚔️", "STRENGTH", 3, "#ef4444")}
        {renderAttribute("🛡️", "ENDURANCE", 3, "#f97316")}
        {renderAttribute("🧘", "DISCIPLINE", 3, "#a855f7")}
        {renderAttribute("🎯", "FOCUS", 3, "#38bdf8")}
        {renderAttribute("📘", "INTELLIGENCE", 3, "#34d399")}
        {renderAttribute("⚡", "AGILITY", 3, "#eab308")}
      </View>

      {/* DAILY QUESTS SECTION */}
      <View style={styles.questsContainer}>
        <Text style={styles.questsTitle}>DAILY QUESTS</Text>

        {renderQuest("💪", "Morning Workout", "+150 XP · STRENGTH", 150)}
        {renderQuest("📚", "Read 30 Minutes", "+75 XP · INTELLIGENCE", 75)}
        {renderQuest("🧘", "Meditate", "+100 XP · FOCUS", 100)}
        {renderQuest("🧊", "Cold Shower", "+50 XP · DISCIPLINE", 50)}
        {renderQuest("🏃", "Run 5K", "+350 XP · ENDURANCE", 350)}
        {renderQuest("🤸", "Stretch Routine", "+50 XP · AGILITY", 50)}
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
