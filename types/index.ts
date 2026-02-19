export type Attribute = 'STRENGTH' | 'ENDURANCE' | 'DISCIPLINE' | 'FOCUS' | 'INTELLIGENCE' | 'AGILITY';

export type Frequency = 'daily';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  frequency: Frequency;
  attribute: Attribute[];
  xpReward: number;
  createdAt: string;
  completedDates: string[];
}