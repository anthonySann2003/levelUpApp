import { Quest } from '../types';

export const QUEST_POOL: Quest[] = [
  // STRENGTH
  { icon: "💪", title: "Arm Wrestle Someone and Win", reward: "+150 XP · STRENGTH", xpReward: 150, attribute: "STRENGTH" },
  { icon: "🏋️", title: "Do 15 Push Ups", reward: "+50 XP · STRENGTH", xpReward: 50, attribute: "STRENGTH" },
  { icon: "🏋️‍♂️", title: "Do 10 Squat Jumps", reward: "+75 XP · STRENGTH", xpReward: 75, attribute: "STRENGTH" },
  { icon: "🧗‍♂️", title: "Do 10 Pull Ups (Assisted or Unassisted)", reward: "+100 XP · STRENGTH", xpReward: 100, attribute: "STRENGTH" },
  { icon: "🧎", title: "Do 10 Lunges", reward: "+50 XP · STRENGTH", xpReward: 50, attribute: "STRENGTH" },
  { icon: "🥜", title: "Do 30 Crunches", reward: "+100 XP · STRENGTH", xpReward: 100, attribute: "STRENGTH" },

  // ENDURANCE
  { icon: "🏃", title: "Jog for 5 minutes", reward: "+350 XP · ENDURANCE", xpReward: 350, attribute: "ENDURANCE" },
  { icon: "🚴", title: "Cycle for 10 Minutes", reward: "+150 XP · ENDURANCE", xpReward: 150, attribute: "ENDURANCE" },
  { icon: "🪵", title: "Plank for 3 minutes", reward: "+200 XP · ENDURANCE", xpReward: 200, attribute: "ENDURANCE" },
  { icon: "🚶", title: "Walk 10,000 Steps", reward: "+250 XP · ENDURANCE", xpReward: 250, attribute: "ENDURANCE" },
  { icon: "🧗‍♂️", title: "Dead hang for 30 seconds", reward: "+100 XP · ENDURANCE", xpReward: 100, attribute: "ENDURANCE" },
  { icon: "🪑", title: "Wall sit for 1 minute", reward: "+100 XP · ENDURANCE", xpReward: 100, attribute: "ENDURANCE" },

  // DISCIPLINE
  { icon: "🧊", title: "Cold Shower", reward: "+100 XP · DISCIPLINE", xpReward: 100, attribute: "DISCIPLINE" },
  { icon: "📵", title: "No Phone for 2 Hours", reward: "+75 XP · DISCIPLINE", xpReward: 75, attribute: "DISCIPLINE" },
  { icon: "🛏️", title: "Make Your Bed", reward: "+25 XP · DISCIPLINE", xpReward: 25, attribute: "DISCIPLINE" },
  { icon: "⏰", title: "Go to bed before Midnight", reward: "+100 XP · DISCIPLINE", xpReward: 100, attribute: "DISCIPLINE" },
  { icon: "😱", title: "Do something you've been procrastinating", reward: "+350 XP · DISCIPLINE", xpReward: 350, attribute: "DISCIPLINE" },
  { icon: "🥦", title: "Eat Vegetables", reward: "+50 XP · DISCIPLINE", xpReward: 50, attribute: "DISCIPLINE" },

  // FOCUS
  { icon: "🧘", title: "Meditate for 5 Minutes", reward: "+100 XP · FOCUS", xpReward: 100, attribute: "FOCUS" },
  { icon: "📓", title: "Journal for 3 Minutes", reward: "+75 XP · FOCUS", xpReward: 75, attribute: "FOCUS" },
  { icon: "🎯", title: "Single Task for 30 Minutes", reward: "+300 XP · FOCUS", xpReward: 300, attribute: "FOCUS" },
  { icon: "🌬️", title: "5 Minute Breathing Exercise", reward: "+50 XP · FOCUS", xpReward: 50, attribute: "FOCUS" },
  { icon: "📓", title: "Write a recent lesson you learned", reward: "+100 XP · FOCUS", xpReward: 100, attribute: "FOCUS" },
  { icon: "🍽️", title: "Eat a meal without a screen", reward: "+500 XP · FOCUS", xpReward: 500, attribute: "FOCUS" },

  // INTELLIGENCE
  { icon: "📚", title: "Read For 15 Minutes", reward: "+100 XP · INTELLIGENCE", xpReward: 100, attribute: "INTELLIGENCE" },
  { icon: "🧩", title: "Solve a Brain Puzzle", reward: "+75 XP · INTELLIGENCE", xpReward: 75, attribute: "INTELLIGENCE" },
  { icon: "✍️", title: "Learn 5 New Words", reward: "+50 XP · INTELLIGENCE", xpReward: 50, attribute: "INTELLIGENCE" },
  { icon: "🦦", title: "Watch a video on an obscure animal", reward: "+50 XP · INTELLIGENCE", xpReward: 50, attribute: "INTELLIGENCE" },
  { icon: "🎓", title: "Complete the Wordle", reward: "+50 XP · INTELLIGENCE", xpReward: 50, attribute: "INTELLIGENCE" },
  { icon: "📈", title: "Research one Stock for 5 minutes", reward: "+50 XP · INTELLIGENCE", xpReward: 50, attribute: "INTELLIGENCE" },


  // AGILITY
  { icon: "🤸", title: "Try a Beginner's Stretch Routine", reward: "+250 XP · AGILITY", xpReward: 250, attribute: "AGILITY" },
  { icon: "🤸‍♀", title: "Try the World's Greatest Stretch", reward: "+50 XP · AGILITY", xpReward: 50, attribute: "AGILITY" },
  { icon: "⚽", title: "Play a Sport for 20 Minutes", reward: "+150 XP · AGILITY", xpReward: 150, attribute: "AGILITY" },
  { icon: "🤸", title: "Try the Thread the Needle Yoga Pose", reward: "+50 XP · AGILITY", xpReward: 50, attribute: "AGILITY" },
  { icon: "🤸‍♂️", title: "Try the Lizard Pose", reward: "+75 XP · AGILITY", xpReward: 75, attribute: "AGILITY" },
  { icon: "🐇", title: "Small Jumps for 1 Minute", reward: "+75 XP · AGILITY", xpReward: 75, attribute: "AGILITY" },
];