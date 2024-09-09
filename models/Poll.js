const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: [{ type: String, required: true }], // Array of correct answers
  results: { type: Map, of: Number }
});

module.exports = mongoose.model('Poll', PollSchema);
