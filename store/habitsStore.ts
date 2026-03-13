import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { fetchBounties as fetchBountiesService } from '../api/bountiesService';
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
  bounties: Quest[];
  bountiesLastFetched: string;
  completedBounties: string[];
  completeQuest: (title: string, xpReward: number, attribute: Attribute) => void;
  completeBounty: (title: string, xpReward: number, attribute: Attribute) => void;
  refreshDailyQuests: () => void;
  completeOnboarding: (name: string, strongest: Attribute, weakest: Attribute) => void;
  clearLevelUp: () => void;
  fetchBounties: (context: { habits: { name: string; attribute: string }[]; attributes: Record<string, number>; level: number }) => Promise<void>;
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
      bounties: [],
      completedBounties: [],
      bountiesLastFetched: '',
      
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
    

      // -- Handles daily quest completion --
      completeQuest: (title, xpReward, attribute) => set((state) => {
        const isCompleted = state.completedQuests.includes(title);
      
        const xpChange = isCompleted ? -xpReward : xpReward;
        const { level, currentXp, hasJustLeveledUp } = calculateXpAndLevel(state, xpChange);
      
        const updatedAttributes = {
          ...state.attributes,
          [attribute]: Math.max(0, state.attributes[attribute] + (isCompleted ? -1 : 1)),
        };
      
        return {
          completedQuests: isCompleted
            ? state.completedQuests.filter(q => q !== title)
            : [...state.completedQuests, title],
          level,
          currentXp,
          lastXpGained: isCompleted ? 0 : xpReward,
          hasJustLeveledUp,
          attributes: updatedAttributes,
        };
      }),

      // -- Same as complete quest but for complete bounty, seperates the actions for easier debugging
      completeBounty: (title, xpReward, attribute) => set((state) => {
        const isCompleted = state.completedBounties.includes(title);
      
        const xpChange = isCompleted ? -xpReward : xpReward;
        const { level, currentXp, hasJustLeveledUp } = calculateXpAndLevel(state, xpChange);
      
        const updatedAttributes = {
          ...state.attributes,
          [attribute]: Math.max(0, state.attributes[attribute] + (isCompleted ? -1 : 1)),
        };
      
        return {
          completedBounties: isCompleted
            ? state.completedBounties.filter(q => q !== title)
            : [...state.completedBounties, title],
          level,
          currentXp,
          lastXpGained: isCompleted ? 0 : xpReward,
          hasJustLeveledUp,
          attributes: updatedAttributes,
        };
      }),

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

      // -- FUNCTION TO FETCH BOUNTIES --
      fetchBounties: async (context) => {
        const today = getTodayLocal();
        const state = useCharacterStore.getState();
        
        if (state.bountiesLastFetched === today) return;
      
        const quests = await fetchBountiesService(context);
        
        set({
          bounties: quests,
          bountiesLastFetched: today,
        });
      },

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