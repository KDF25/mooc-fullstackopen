const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.findAll()
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = await Blog.create(request.body)
    return response.status(201).json(blog)
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByPk(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  await blog.destroy()
  return response.status(204).end()
})

module.exports = blogsRouter
