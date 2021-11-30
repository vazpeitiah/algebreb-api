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
    type: [mongoose.SchemaTypes.Mixed],
    default: []
  },
  feedback: String,
  isActive: {
    type: Boolean, 
    default: true
  }
})

module.exports = mongoose.model('ApplyExam', ApplyExamSchema)