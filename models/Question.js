const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    // Removed strict enum to allow flexibility for 'React', 'JavaScript', etc.
  },
  role: {
    type: String,
    required: true,
    // Removed strict enum to allow 'Frontend Developer', etc.
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  }
});

module.exports = mongoose.model('Question', QuestionSchema);