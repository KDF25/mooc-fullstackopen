import Link from "next/link"
import { getBlogs } from "../services/blogs"

const Blogs = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) => {
  const { filter } = await searchParams
  const allBlogs = getBlogs()
  const blogs = filter
    ? allBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(filter.toLowerCase())
      )
    : allBlogs

  return (
    <div>
      <h2>Blogs</h2>
      <form action="/blogs" method="GET">
        <input
          type="text"
          name="filter"
          defaultValue={filter ?? ""}
        />
        <button type="submit">search</button>
      </form>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>{" "}
            {blog.author} {blog.url} likes {blog.likes}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs
