const mongoose = require('mongoose')

const ApplyExamSchema = new mongoose.Schema({
  exam: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Exam',
    required: true
  },
  student: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    require: true
  },
  grade: {
    type: Number,
    default: 0
  },
  answers: {
    type: [String],
    default: []
  },
  feedback: String
})

module.exports = mongoose.model('ApplyExam', ApplyExamSchema)