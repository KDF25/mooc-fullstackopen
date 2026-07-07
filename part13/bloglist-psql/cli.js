const { Blog } = require('./models')
const { connectToDatabase, sequelize } = require('./util/db')

const main = async () => {
  try {
    await connectToDatabase()
    const blogs = await Blog.findAll()

    blogs.forEach((blog) => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })

    await sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}

main()
