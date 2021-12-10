const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
  name: String,
  teacher: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  students: {
    type: [mongoose.Types.ObjectId],
    ref: "User"
  }
})

module.exports = mongoose.model('Group', groupSchema)