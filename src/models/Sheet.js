const mongoose = require('mongoose')

const sheetSchema = new mongoose.Schema({
  description: String,
  user: {type: mongoose.Types.ObjectId, ref: "User"},
  date: { type: Date, default: Date.now },
  type: String,
  exercises: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  solutionsType: String,
  params: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  hidden: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Sheet', sheetSchema)