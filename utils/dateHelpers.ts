import { QUEST_POOL } from '../constants/questPool';
import { Quest } from '../types';

export function getTodayLocal(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  export function getDailyQuests(date: string): Quest[] {
    // create a simple numeric hash from the date string
    let hash = 0;
    for (let i = 0; i < date.length; i++) {
      hash = (hash * 31 + date.charCodeAt(i)) % 1000000;
    }
  
    // pick one quest per attribute using the hash as a seed
    const attributes = ['STRENGTH', 'ENDURANCE', 'DISCIPLINE', 'FOCUS', 'INTELLIGENCE', 'AGILITY'];
    const selected: Quest[] = [];
  
    attributes.forEach((attr, index) => {
      const pool = QUEST_POOL.filter(q => q.attribute === attr);
      const pick = (hash + index * 7) % pool.length;
      selected.push(pool[pick]);
    });
  
    return selected;
  }