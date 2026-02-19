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
      addXp: (amount) => set((state) => {
        const newXp = state.currentXp + amount;
        if (newXp >= state.xpToNextLevel) {
          return { level: state.level + 1, currentXp: newXp - state.xpToNextLevel };
        }
        return { currentXp: newXp };
      }),
      completeQuest: (title, xpReward) => set((state) => {
        if (state.completedQuests.includes(title)) return state;
        const newXp = state.currentXp + xpReward;
        if (newXp >= state.xpToNextLevel) {
          return {
            completedQuests: [...state.completedQuests, title],
            level: state.level + 1,
            currentXp: newXp - state.xpToNextLevel,
          };
        }
        return {
          completedQuests: [...state.completedQuests, title],
          currentXp: newXp,
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
      
        // handle level up
        if (!isCurrentlyComplete && newXp >= state.xpToNextLevel) {
          return {
            habits: updatedHabits,
            level: state.level + 1,
            currentXp: newXp - state.xpToNextLevel,
          };
        }
      
        // handle XP going below 0 on uncheck
        return {
          habits: updatedHabits,
          currentXp: Math.max(0, newXp),
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