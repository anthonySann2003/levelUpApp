interface XpState {
    level: number;
    currentXp: number;
    xpToNextLevel: number;
  }
  
  interface XpResult {
    level: number;
    currentXp: number;
    hasJustLeveledUp: boolean;
  }
  
  export function calculateXpAndLevel(state: XpState, xpChange: number): XpResult {
    let level = state.level;
    let currentXp = state.currentXp + xpChange;
    let hasJustLeveledUp = false;
  
    // handle level up — loop in case xpChange is large enough to skip multiple levels
    while (currentXp >= state.xpToNextLevel) {
      level += 1;
      currentXp = currentXp - state.xpToNextLevel;
      hasJustLeveledUp = true;
    }
  
    // handle level down — loop in case xpChange is large enough to skip multiple levels
    while (currentXp < 0 && level > 1) {
      level -= 1;
      currentXp = state.xpToNextLevel + currentXp; // currentXp is negative so this subtracts
    }
  
    // floor at level 1, 0 xp — can never go below this
    if (currentXp < 0) {
      currentXp = 0;
    }
  
    return { level, currentXp, hasJustLeveledUp };
  }