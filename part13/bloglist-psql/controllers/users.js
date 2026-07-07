const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models')

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
