export function calculateStreak(completedDates: string[]): number {
    if (completedDates.length === 0) return 0;
  
    const today = new Date();
    let streak = 0;
    let checkDate = new Date(today);
  
    // start checking from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  
    while (true) {
      const dateString = checkDate.toISOString().split('T')[0];
      
      if (completedDates.includes(dateString)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  
    // if completed today, streak is at least 1
    const todayString = today.toISOString().split('T')[0];
    if (completedDates.includes(todayString) && streak === 0) {
      return 1;
    }
  
    return streak + (completedDates.includes(todayString) ? 1 : 0);
  }