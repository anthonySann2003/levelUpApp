import { getTodayLocal } from './dateHelpers';

export function calculateStreak(completedDates: string[]): number {
    if (completedDates.length === 0) return 0;
  
    const todayString = getTodayLocal();
    let streak = 0;
    
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - 1);
  
    while (true) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
  
      if (completedDates.includes(dateString)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  
    if (completedDates.includes(todayString) && streak === 0) {
      return 1;
    }
  
    return streak + (completedDates.includes(todayString) ? 1 : 0);
  }