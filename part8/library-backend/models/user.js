const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  favoriteGenre: {
    type: String,
    required: true,
    minlength: 2,
  },
  passwordHash: String,
})

schema.pre('save', async function () {
  if (!this.passwordHash) {
    this.passwordHash = await bcrypt.hash('secret', 10)
  }
})

module.exports = mongoose.model('User', schema)
