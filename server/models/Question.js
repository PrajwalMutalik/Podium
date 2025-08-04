const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Behavioral', 'Technical', 'System Design'],
  },
  role: {
    type: String,
    required: true,
    enum: ['SDE', 'Product Manager', 'Data Analyst'],
  },
});

module.exports = mongoose.model('Question', QuestionSchema);