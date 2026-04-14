# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LUL is a React Native mobile habit tracker with RPG gamification — users complete daily habits and quests to earn XP, level up, and grow 6 attributes (STRENGTH, ENDURANCE, DISCIPLINE, FOCUS, INTELLIGENCE, AGILITY). AI-generated daily "Bounties" are powered by a separate Python/FastAPI backend on Railway.

## Commands

```bash
npx expo start            # Start dev server
npx expo start --clear    # Clear cache (use after .env changes)
npm run android           # Android emulator
npm run ios               # iOS simulator
npm run lint              # ESLint
eas update --branch preview --message "description"  # OTA update to Expo Go testers
```

**Backend (separate repo, runs locally):**
```bash
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
uvicorn main:app --reload
```

## Architecture

**Tech stack:** React Native + Expo SDK 54, Expo Router v6 (file-based), Zustand v5 (single store), AsyncStorage (persistence), TypeScript, expo-audio.

**Key layout:** `app/_layout.tsx` is the root — it mounts `XpBar` and `LevelUpOverlay` globally (so they appear over all screens), calls `useLevelUpSound()` once, and redirects to `/onboarding` on first launch via a `setTimeout(100ms)` workaround to avoid "navigate before mount" errors.

**Single store pattern:** All app state lives in `store/habitsStore.ts`. Local `useState` is only for UI-only state (form fields, modal visibility). Never split into multiple stores.

**Shared XP logic:** `utils/xpHelper.ts` → `calculateXpAndLevel()` is the single source of truth for XP/level changes, used by `completeQuest`, `completeBounty`, and `toggleHabitComplete`. Never duplicate this logic.

**Dumb components:** `HabitCard.tsx` receives all data and callbacks via props — never imports from the store directly.

**Quest pool:** `constants/questPool.ts` has 24 predefined quests (4 per attribute). `getDailyQuests()` uses a deterministic date hash — same date always returns the same 6 quests. Adding quests here automatically increases variety.

## Critical Rules

### Date Handling
Always use `getTodayLocal()` from `utils/dateHelpers.ts`. **Never** use `new Date().toISOString().split('T')[0]` — that returns UTC and causes midnight reset bugs for non-UTC users.

### Audio
Use `expo-audio` (not `expo-av` — deprecated in SDK 54). Always call `player.seekTo(0)` before `player.play()` to allow replay after the first trigger.

### Animation Drivers
- `translateY` → `useNativeDriver: true`
- `opacity` and `width` → `useNativeDriver: false`
- **Never mix drivers on the same `Animated.Value`** — causes a runtime crash. Use separate `Animated.View` wrappers when both are needed.

### Store Persistence
`partialize` excludes `lastXpGained` and `hasJustLeveledUp` from AsyncStorage — these are animation triggers that must reset on app load. When making breaking store shape changes, increment the persist key (currently `"character-storage-v2"`).

### Navigation
Use `router.replace()` (not `router.push()`) for onboarding completion to prevent back navigation. The `as any` cast on route strings is a known Expo Router TypeScript workaround.

### Backend / Security
OpenAI API key lives **only** in Railway env vars — never in any frontend file. Never commit `.env` (contains `EXPO_PUBLIC_API_URL`). The bounties API always returns an empty array on error so the app degrades gracefully.

## Attribute System

6 attributes start at 3 (or 6 if chosen as strongest, 1 if weakest during onboarding). They increment/decrement by 1 on quest/habit/bounty completion or uncheck. Never go below 0. Attribute bar max scales as `level * 5`.

## Color Palette

| Use | Value |
|-----|-------|
| Background | `#000000` |
| Card background | `#111827` |
| Secondary background | `#1f2937` |
| Border | `#374151` |
| Primary text | `#ffffff` |
| Secondary text | `#9ca3af` |
| Gold accent | `#facc15` |
| Red (danger/weakest) | `#ef4444` |
| Quest item background | `#0f172a` |

## Known TODOs Affecting Development

- **Remove dev reset button** in `character.tsx` before any public release
- **Fetch bounties on app load** — currently fetches when the Bounties tab opens; move to `_layout.tsx`
- **Navigation restructure** — move to Stack + Tabs pattern (currently tabled)
- **Scale `xpToNextLevel`** — fixed at 500; `calculateXpAndLevel` already supports variable thresholds via while loops
- **Multi-attribute habits** — `habit.attribute` is already an array but only index `[0]` is used

## Python Backend (quest-api — separate repo)

Railway auto-deploys on every push to GitHub. Endpoints: `POST /generate-bounties` and `GET /health`. Habit names are sanitized to 50 chars max server-side to prevent prompt injection. The `Quest` type returned must match the TypeScript `Quest` interface in `types/index.ts`.

**Railway env vars:** `OPENAI_API_KEY`, `LANGCHAIN_API_KEY`, `LANGCHAIN_TRACING_V2=true`, `LANGCHAIN_PROJECT=quest-api`
