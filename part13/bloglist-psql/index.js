const app = require('./app')
const Blog = require('./models/blog')
const sequelize = require('./models/sequelize')
const { PORT } = require('./utils/config')

const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    await Blog.sync()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}

start()
