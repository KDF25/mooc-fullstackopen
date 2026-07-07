const Blog = require('./models/blog')
const sequelize = require('./models/sequelize')

const main = async () => {
  try {
    await sequelize.authenticate()
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
