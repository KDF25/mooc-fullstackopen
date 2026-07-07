const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const {
  blogFinder,
  tokenExtractor,
  sessionValidator,
} = require('../util/middleware')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    ...(Object.keys(where).length > 0 && { where }),
    order: [['likes', 'DESC']],
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, sessionValidator, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
    })
    res.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

router.delete(
  '/:id',
  tokenExtractor,
  sessionValidator,
  blogFinder,
  async (req, res) => {
    if (req.blog.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'operation not permitted' })
    }
    await req.blog.destroy()
    res.status(204).end()
  },
)

module.exports = router
