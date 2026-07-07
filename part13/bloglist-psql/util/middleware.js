const jwt = require('jsonwebtoken')
const { Blog, Session } = require('../models')
const { SECRET } = require('./config')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    try {
      req.token = authorization.replace('Bearer ', '')
      req.decodedToken = jwt.verify(req.token, SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const sessionValidator = async (req, res, next) => {
  const session = await Session.findOne({
    where: {
      token: req.token,
      userId: req.decodedToken.id,
    },
  })

  if (!session) {
    return res.status(401).json({ error: 'session invalid' })
  }

  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    return res.status(400).json({
      error: error.errors.map((e) => e.message),
    })
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  }

  console.error(error.message)
  res.status(500).json({ error: 'internal server error' })
}

module.exports = {
  blogFinder,
  tokenExtractor,
  sessionValidator,
  unknownEndpoint,
  errorHandler,
}
