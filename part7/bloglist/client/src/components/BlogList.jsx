import { Link } from 'react-router-dom'
import { useBlogStore } from '../stores/blogStore'

const BlogList = () => {
  const blogs = useBlogStore((state) => state.blogs)

  return (
    <div>
      <h2>blogs</h2>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <div key={blog.id} className="blog">
            <span className="blogTitle">
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </span>{' '}
            <span className="blogAuthor">{blog.author}</span>
          </div>
        ))}
    </div>
  )
}

export default BlogList
