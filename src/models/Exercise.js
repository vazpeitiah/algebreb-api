const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
  statement: String,
  correctAnswer: String, 
  answers: [String],
  steps: [String]
})

module.exports = mongoose.model('Exercise', exerciseSchema)