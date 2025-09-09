const mongoose = require('mongoose');

// This is the corrected schema that your middleware is designed to work with.
// It uses the correct field names: `geminiApiKey`, `apiUsageCount`, and `lastApiUsageDate`.
const UserSchema = new mongoose.Schema({
  // --- NEW GAMIFICATION FIELDS ---
  
  // Points act like experience (XP) for the user.
  points: {
    type: Number,
    default: 0,
  },
  
  // Tracks consecutive days of practice.
  currentStreak: {
    type: Number,
    default: 0,
  },
  
  // Stores the date of the last practice to calculate the streak.
  lastPracticeDate: {
    type: Date,
  },
  
  // An array to store the names of earned badges.
  badges: {
    type: [String],
    default: [],
  },
  
  // --- END OF NEW FIELDS ---
  
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // Field for the user's personal API key to bypass the limit.
  geminiApiKey: {
    type: String,
    default: '',
  },
  // The counter for daily API calls.
  apiUsageCount: {
    type: Number,
    default: 0,
  },
  // The date of the last API call, for resetting the counter.
  lastApiUsageDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);
