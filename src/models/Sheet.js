const mongoose = require('mongoose')
const Exercise = require('./Exercise')

const sheetSchema = new mongoose.Schema({
  description: String,
  user: {type: mongoose.Types.ObjectId, ref: "User"},
  date: { type: Date, default: Date.now },
  type: String,
  exercises: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  solutionsType: String
})

module.exports = mongoose.model('Sheet', sheetSchema)