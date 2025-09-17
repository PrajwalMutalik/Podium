// server/services/gamificationService.js

const User = require('../models/User');

// --- Helper function to check if two dates are on consecutive days ---
const areConsecutiveDays = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  // Reset hours to compare dates only
  firstDate.setHours(0, 0, 0, 0);
  secondDate.setHours(0, 0, 0, 0);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay)) === 1;
};


// --- Main function to process gamification after a session ---
const processGamification = async (userId, sessionData) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // 1. Award Points
    // Simple logic: 10 points for completion, bonus for good performance.
    let pointsAwarded = 10;
    if (sessionData.wpm > 120 && sessionData.wpm < 160) pointsAwarded += 5; // Bonus for good pace
    if (sessionData.fillerWordCount <= 2) pointsAwarded += 5; // Bonus for few fillers
    user.points += pointsAwarded;

    // 2. Update Streak
    const today = new Date();
    if (user.lastPracticeDate) {
      const lastPractice = new Date(user.lastPracticeDate);
      const todayDateOnly = new Date(today.setHours(0, 0, 0, 0));
      const lastPracticeDateOnly = new Date(lastPractice.setHours(0, 0, 0, 0));

      if (areConsecutiveDays(today, lastPractice)) {
        user.currentStreak += 1; // It's a consecutive day
      } else if (todayDateOnly.getTime() !== lastPracticeDateOnly.getTime()) {
        user.currentStreak = 1; // It's a new day, but not consecutive, so reset to 1
      }
      // If it's the same day, do nothing to the streak.
    } else {
      // First time practicing
      user.currentStreak = 1;
    }
    user.lastPracticeDate = today;

    // 3. Award Badges (Example Badges)
    // You can add many more badge conditions here.
    if (!user.badges.includes('FirstStep') && user.points > 0) {
      user.badges.push('FirstStep'); // Badge for completing the first session
    }
    if (!user.badges.includes('Speedster') && sessionData.wpm > 180) {
      user.badges.push('Speedster'); // Badge for speaking quickly
    }
    if (!user.badges.includes('Eloquent') && sessionData.fillerWordCount === 0) {
      user.badges.push('Eloquent'); // Badge for using no filler words
    }
    if (!user.badges.includes('WeekStreak') && user.currentStreak >= 7) {
      user.badges.push('WeekStreak'); // Badge for a 7-day streak
    }

    await user.save();
    console.log(`Gamification processed for user ${userId}: ${pointsAwarded} points, streak ${user.currentStreak}`);

  } catch (error) {
    console.error('Error in processGamification:', error);
  }
};

module.exports = { processGamification };