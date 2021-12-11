const mongoose = require('mongoose')

const ExamDataSchema = new mongoose.Schema({
  sheet: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Sheet',
    required: true
  },
  group: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Group',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now() // today
  },
  endDate: {
    type: Date,
    default: Date.now() + 60 * 60 * 24 * 1000 // next day
  },
  type: String,
  different: Boolean
})

module.exports = mongoose.model('ExamData', ExamDataSchema)