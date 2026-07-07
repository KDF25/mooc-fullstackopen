const express = require('express')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const authorsRouter = require('./controllers/authors')
const readinglistsRouter = require('./controllers/readinglists')
const { Blog, User, ReadingList, Session } = require('./models')
const { unknownEndpoint, errorHandler } = require('./util/middleware')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).end()
})

app.post('/api/reset', async (req, res, next) => {
  try {
    await ReadingList.destroy({ where: {}, truncate: true, cascade: true })
    await Session.destroy({ where: {}, truncate: true, cascade: true })
    await Blog.destroy({ where: {}, truncate: true, cascade: true })
    await User.destroy({ where: {}, truncate: true, cascade: true })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readinglistsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
