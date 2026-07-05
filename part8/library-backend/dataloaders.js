const mongoose = require('mongoose')
const DataLoader = require('dataloader')
const Book = require('./models/book')

const createBookCountLoader = () => {
  return new DataLoader(async (authorIds) => {
    const objectIds = authorIds.map((id) => new mongoose.Types.ObjectId(id))
    const counts = await Book.aggregate([
      { $match: { author: { $in: objectIds } } },
      { $group: { _id: '$author', count: { $sum: 1 } } },
    ])

    const countMap = {}
    counts.forEach(({ _id, count }) => {
      countMap[_id.toString()] = count
    })

    return authorIds.map((id) => countMap[id.toString()] || 0)
  })
}

module.exports = { createBookCountLoader }
