const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models')

const formatReadings = (blogs) =>
  blogs.map((blog) => {
    const blogJson = blog.toJSON()
    const readingList = blogJson.reading_list

    return {
      id: blogJson.id,
      title: blogJson.title,
      author: blogJson.author,
      url: blogJson.url,
      likes: blogJson.likes,
      year: blogJson.year,
      reading_list: {
        id: readingList.id,
        read: readingList.read,
      },
    }
  })

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const throughWhere = {}

  if (req.query.read === 'true') {
    throughWhere.read = true
  } else if (req.query.read === 'false') {
    throughWhere.read = false
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: {
      model: Blog,
      as: 'readings',
      through: {
        attributes: ['id', 'read'],
        ...(Object.keys(throughWhere).length > 0 && { where: throughWhere }),
      },
    },
  })

  if (!user) {
    return res.status(404).end()
  }

  res.json({
    name: user.name,
    username: user.username,
    readings: formatReadings(user.readings),
  })
})

router.post('/', async (req, res, next) => {
  const { name, username, password } = req.body

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
      name,
      username,
      passwordHash,
    })

    res.status(201).json({
      id: user.id,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    })
    if (!user) {
      return res.status(404).end()
    }
    user.name = req.body.name
    await user.save()
    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
