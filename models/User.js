const mongoose = require('mongoose');

// This is the corrected schema that your middleware is designed to work with.
const UserSchema = new mongoose.Schema({
  // --- NEW GAMIFICATION FIELDS ---
  points: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  lastPracticeDate: { type: Date },
  badges: { type: [String], default: [] },
  // --- END OF NEW FIELDS ---

  name: {
    type: String,
    required: true,
  },
  // Added unique username field
  username: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values for existing users
    trim: true
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
