import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Attribute, Habit, Quest } from '../types';
import { getDailyQuests, getTodayLocal } from '../utils/dateHelpers';

//Character state variables
interface CharacterState {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  completedQuests: string[];
  dailyQuestDate: string;    
  dailyQuests: Quest[];      
  attributes: {
    STRENGTH: number;
    ENDURANCE: number;
    DISCIPLINE: number;
    FOCUS: number;
    INTELLIGENCE: number;
    AGILITY: number;
  };
  addXp: (amount: number) => void;
  completeQuest: (title: string, xpReward: number, attribute: Attribute) => void;
  resetQuests: () => void;
  refreshDailyQuests: () => void;
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
      dailyQuestDate: '',      //Daily quest date
      dailyQuests: [],         //Array of the days daily quests
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
      completeQuest: (title, xpReward, attribute) => set((state) => {
        if (state.completedQuests.includes(title)) return state;
      
        const newXp = state.currentXp + xpReward;
        const updatedAttributes = {
          ...state.attributes,
          [attribute]: state.attributes[attribute] + 1,
        };
      
        if (newXp >= state.xpToNextLevel) {
          return {
            completedQuests: [...state.completedQuests, title],
            level: state.level + 1,
            currentXp: newXp - state.xpToNextLevel,
            attributes: updatedAttributes,
          };
        }
        return {
          completedQuests: [...state.completedQuests, title],
          currentXp: newXp,
          attributes: updatedAttributes,
        };
      }),

      resetQuests: () => set({ completedQuests: [] }),

      // --Action to refresh the daily quests from array of predetermined quests

      refreshDailyQuests: () => set((state) => {   // ← new
        const today = getTodayLocal();
        if (state.dailyQuestDate === today) return state;
        return {
          dailyQuestDate: today,
          dailyQuests: getDailyQuests(today),
          completedQuests: [],
        };
      }),

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