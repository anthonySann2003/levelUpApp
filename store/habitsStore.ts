import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CharacterState {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  completedQuests: string[];
  addXp: (amount: number) => void;
  completeQuest: (title: string, xpReward: number) => void;
  resetQuests: () => void;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'character-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);