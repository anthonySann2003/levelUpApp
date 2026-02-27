import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Attribute, Habit, Quest } from '../types';
import { getDailyQuests, getTodayLocal } from '../utils/dateHelpers';
import { calculateXpAndLevel } from '../utils/xpHelper';

//Character state variables
interface CharacterState {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  completedQuests: string[];
  dailyQuestDate: string;    
  dailyQuests: Quest[];
  lastXpGained: number;
  hasJustLeveledUp: boolean      
  attributes: {
    STRENGTH: number;
    ENDURANCE: number;
    DISCIPLINE: number;
    FOCUS: number;
    INTELLIGENCE: number;
    AGILITY: number;
  };
  hasCompletedOnboarding: boolean;
  characterName: string;
  strongestAttribute: Attribute | null;
  weakestAttribute: Attribute | null;
  addXp: (amount: number) => void;
  completeQuest: (title: string, xpReward: number, attribute: Attribute) => void;
  resetQuests: () => void;
  refreshDailyQuests: () => void;
  completeOnboarding: (name: string, strongest: Attribute, weakest: Attribute) => void;
  clearLevelUp: () => void;
}

//Habit interface
interface HabitsState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => void;
  toggleHabitComplete: (habitId: string, date: string) => void;
  deleteHabit: (habitId: string) => void;
  editHabit: (habitId: string, updates: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => void;
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
      lastXpGained: 0,
      hasJustLeveledUp: false,
      attributes: { //Adding starting attributes
        STRENGTH: 3, 
        ENDURANCE: 3,
        DISCIPLINE: 3,
        FOCUS: 3,
        INTELLIGENCE: 3,
        AGILITY: 3,
      },
      hasCompletedOnboarding: false,
      characterName: '',
      strongestAttribute: null,
      weakestAttribute: null,
      
      completeOnboarding: (name, strongest, weakest) => set(() => {
        const startingAttributes = {
          STRENGTH: 3,
          ENDURANCE: 3,
          DISCIPLINE: 3,
          FOCUS: 3,
          INTELLIGENCE: 3,
          AGILITY: 3,
        };
      
        startingAttributes[strongest] = 6;
        startingAttributes[weakest] = 1;
      
        return {
          hasCompletedOnboarding: true,
          characterName: name,
          strongestAttribute: strongest,
          weakestAttribute: weakest,
          attributes: startingAttributes,
        };
      }),
      
      addXp: (amount) => set((state) => {
        const newXp = state.currentXp + amount;
        if (newXp >= state.xpToNextLevel) {
          return { level: state.level + 1, currentXp: newXp - state.xpToNextLevel };
        }
        return { currentXp: newXp };
      }),

      // -- Handles daily quest completion --
      completeQuest: (title, xpReward, attribute) => set((state) => {
        if (state.completedQuests.includes(title)) return state;
      
        const { level, currentXp, hasJustLeveledUp } = calculateXpAndLevel(state, xpReward);
      
        const updatedAttributes = {
          ...state.attributes,
          [attribute]: state.attributes[attribute] + 1,
        };
      
        return {
          completedQuests: [...state.completedQuests, title],
          level,
          currentXp,
          lastXpGained: xpReward,
          hasJustLeveledUp,
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

      // -- CLEARS LEVEL UP FOR ANIMATION --
      clearLevelUp: () => set({ hasJustLeveledUp: false }),

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
        const habit = state.habits.find(h => h.id === habitId);
        if (!habit) return state;
      
        const isCurrentlyComplete = habit.completedDates.includes(date);
      
        const updatedHabits = state.habits.map(h =>
          h.id !== habitId ? h :
          isCurrentlyComplete
            ? { ...h, completedDates: h.completedDates.filter(d => d !== date) }
            : { ...h, completedDates: [...h.completedDates, date] }
        );
      
        const xpChange = isCurrentlyComplete ? -habit.xpReward : habit.xpReward;
        const { level, currentXp, hasJustLeveledUp } = calculateXpAndLevel(state, xpChange);
      
        const updatedAttributes = {
          ...state.attributes,
          [habit.attribute[0]]: Math.max(0, state.attributes[habit.attribute[0] as keyof typeof state.attributes] + (isCurrentlyComplete ? -1 : 1)),
        };
      
        return {
          habits: updatedHabits,
          level,
          currentXp,
          lastXpGained: isCurrentlyComplete ? 0 : habit.xpReward,
          hasJustLeveledUp,
          attributes: updatedAttributes,
        };
      }),

      deleteHabit: (habitId) => set((state) => ({
        habits: state.habits.filter(h => h.id !== habitId)
      })),

      editHabit: (habitId, updates) => set((state) => ({
        habits: state.habits.map(h =>
          h.id !== habitId ? h : {
            ...h,
            ...updates,
          }
        )
      })),
    }),
    
    {
      name: 'character-storage-v2', //Change every time for fresh store when making changes
      storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            !['lastXpGained', 'hasJustLeveledUp'].includes(key)
          )
        ),
    }
  )
);