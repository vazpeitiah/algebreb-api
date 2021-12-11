const mongoose = require('mongoose')

const ExamSchema = new mongoose.Schema({
  examData: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'ExamData',
    required: true
  },
  sheet: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Sheet',
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
  },
  images: {
    type: [String],
    default: []
  }
})

module.exports = mongoose.model('Exam', ExamSchema)