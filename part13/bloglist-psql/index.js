const app = require('./app')
const { connectToDatabase } = require('./util/db')
const { initDb } = require('./models')
const { PORT } = require('./util/config')

const start = async () => {
  await connectToDatabase()
  await initDb()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
