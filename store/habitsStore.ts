import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Habit } from '../types';

//Character state variables
interface CharacterState {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  completedQuests: string[];
  attributes: {
    STRENGTH: number;
    ENDURANCE: number;
    DISCIPLINE: number;
    FOCUS: number;
    INTELLIGENCE: number;
    AGILITY: number;
  };
  addXp: (amount: number) => void;
  completeQuest: (title: string, xpReward: number) => void;
  resetQuests: () => void;
}

//Habit interface
interface HabitsState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => void;
  toggleHabitComplete: (habitId: string, date: string) => void;
  deleteHabit: (habitId: string) => void;
}

export const useCharacterStore = create<CharacterState & HabitsState>()(
  persist(
    (set) => ({
      // --- CHARACTER STATE (unchanged) ---
      level: 1,
      currentXp: 0,
      xpToNextLevel: 500,
      completedQuests: [],
      attributes: { //Adding starting attributes
        STRENGTH: 3, 
        ENDURANCE: 3,
        DISCIPLINE: 3,
        FOCUS: 3,
        INTELLIGENCE: 3,
        AGILITY: 3,
      },
      addXp: (amount) => set((state) => {
        const newXp = state.currentXp + amount;
        if (newXp >= state.xpToNextLevel) {
          return { level: state.level + 1, currentXp: newXp - state.xpToNextLevel };
        }
        return { currentXp: newXp };
      }),
      completeQuest: (title, xpReward) => set((state) => {
        if (state.completedQuests.includes(title)) return state;
        const newXp = state.currentXp + xpReward; //Adding xp to total

          // map quest titles to their attribute
          const questAttributes: Record<string, keyof typeof state.attributes> = {
            "Morning Workout": "STRENGTH",
            "Read 30 Minutes": "INTELLIGENCE",
            "Meditate": "FOCUS",
            "Cold Shower": "DISCIPLINE",
            "Run 5K": "ENDURANCE",
            "Stretch Routine": "AGILITY",
          };

          const attr = questAttributes[title]; //Temp code for mapping daily quests to their attribute

          if (newXp >= state.xpToNextLevel) {
            return {
              completedQuests: [...state.completedQuests, title],
              level: state.level + 1,
              currentXp: newXp - state.xpToNextLevel,
              attributes: attr ? {
                ...state.attributes,
                [attr]: state.attributes[attr] + 1,
              } : state.attributes,
            };
          }
          return {
            completedQuests: [...state.completedQuests, title],
            currentXp: newXp,
            attributes: attr ? {
              ...state.attributes,
              [attr]: state.attributes[attr] + 1,
            } : state.attributes,
          };
        }),

      resetQuests: () => set({ completedQuests: [] }),

      // --- HABITS STATE ---
      habits: [],

      addHabit: (newHabit) => set((state) => ({
        habits: [
          ...state.habits,
          {
            ...newHabit,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            completedDates: [],
          }
        ]
      })),

      //Function to handle completed habits on habit screen
      toggleHabitComplete: (habitId, date) => set((state) => {
        const habit = state.habits.find(h => h.id === habitId); //Checking for the correct habit
        if (!habit) return state;
      
        const isCurrentlyComplete = habit.completedDates.includes(date);
        const updatedHabits = state.habits.map(h =>
          h.id !== habitId ? h :
          isCurrentlyComplete
            ? { ...h, completedDates: h.completedDates.filter(d => d !== date) }
            : { ...h, completedDates: [...h.completedDates, date] }
        );
      
        // calculate XP change
        const newXp = isCurrentlyComplete
          ? state.currentXp - habit.xpReward  // unchecking removes XP
          : state.currentXp + habit.xpReward; // checking adds XP
      
          // get the first attribute from the habit's attribute array
        const attr = habit.attribute[0] as keyof typeof state.attributes;

        const updatedAttributes = {
            ...state.attributes,
            [attr]: Math.max(0, state.attributes[attr] + (isCurrentlyComplete ? -1 : 1)),
          };

        // handle level up
        if (!isCurrentlyComplete && newXp >= state.xpToNextLevel) {
          return {
            habits: updatedHabits,
            level: state.level + 1,
            currentXp: newXp - state.xpToNextLevel,
            attributes: updatedAttributes,
          };
        }
      
        // handle XP going below 0 on uncheck
        return {
          habits: updatedHabits,
          currentXp: Math.max(0, newXp),
          attributes: updatedAttributes,
        };
      }),

      deleteHabit: (habitId) => set((state) => ({
        habits: state.habits.filter(h => h.id !== habitId)
      })),
    }),
    {
      name: 'character-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);