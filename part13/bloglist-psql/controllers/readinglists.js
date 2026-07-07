const router = require('express').Router()
const { Blog, User, ReadingList } = require('../models')
const {
  tokenExtractor,
  sessionValidator,
} = require('../util/middleware')

router.post('/', async (req, res, next) => {
  const { blogId, userId } = req.body

  if (!blogId || !userId) {
    return res.status(400).json({ error: 'blogId and userId are required' })
  }

  try {
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    const blog = await Blog.findByPk(blogId)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    const entry = await ReadingList.create({
      blogId,
      userId,
      read: false,
    })

    res.status(201).json({
      id: entry.id,
      blog_id: entry.blogId,
      user_id: entry.userId,
      read: entry.read,
    })
  } catch (error) {
    next(error)
  }
})

router.put(
  '/:id',
  tokenExtractor,
  sessionValidator,
  async (req, res, next) => {
    try {
      const entry = await ReadingList.findByPk(req.params.id)

      if (!entry) {
        return res.status(404).json({ error: 'reading list entry not found' })
      }

      if (entry.userId !== req.decodedToken.id) {
        return res.status(401).json({ error: 'operation not permitted' })
      }

      entry.read = req.body.read
      await entry.save()
      res.json({
        id: entry.id,
        blog_id: entry.blogId,
        user_id: entry.userId,
        read: entry.read,
      })
    } catch (error) {
      next(error)
    }
  },
)

module.exports = router
