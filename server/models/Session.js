const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  transcript: {
    type: String,
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
  fillerWordCount: {
    type: Number,
    required: true,
  },
  aiFeedback: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Session', SessionSchema);