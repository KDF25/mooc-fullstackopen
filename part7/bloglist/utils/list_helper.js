const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined
  return blogs.reduce((max, blog) =>
    blog.likes > max.likes ? blog : max,
  )
}

const mostBlogs = (blogs) => {
  const counts = {}
  blogs.forEach((blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })
  return Object.entries(counts).reduce(
    (top, [author, blogsCount]) =>
      !top || blogsCount > top.blogs ? { author, blogs: blogsCount } : top,
    null,
  )
}

const mostLikes = (blogs) => {
  const likesByAuthor = {}
  blogs.forEach((blog) => {
    likesByAuthor[blog.author] = (likesByAuthor[blog.author] || 0) + blog.likes
  })
  return Object.entries(likesByAuthor).reduce(
    (top, [author, likes]) =>
      !top || likes > top.likes ? { author, likes } : top,
    null,
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
