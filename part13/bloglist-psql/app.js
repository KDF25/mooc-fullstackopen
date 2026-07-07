const express = require('express')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const { Blog, User } = require('./models')
const { unknownEndpoint, errorHandler } = require('./util/middleware')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).end()
})

app.post('/api/reset', async (req, res) => {
  await Blog.destroy({ where: {} })
  await User.destroy({ where: {} })
  res.status(204).end()
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
