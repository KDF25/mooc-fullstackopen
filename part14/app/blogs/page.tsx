import Link from "next/link"
import { getBlogs } from "../services/blogs"

const Blogs = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) => {
  const { filter } = await searchParams
  const allBlogs = await getBlogs()
  const blogs = filter
    ? allBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(filter.toLowerCase()),
      )
    : allBlogs

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Blogs</h2>
      <form action="/blogs" method="GET" className="flex gap-2 mb-6">
        <input
          type="text"
          name="filter"
          defaultValue={filter ?? ""}
          data-testid="filter-input"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          data-testid="search-button"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          search
        </button>
      </form>
      <ul data-testid="blogs-list" className="space-y-2">
        {blogs.map((blog) => (
          <li
            key={blog.id}
            className="border rounded p-3 hover:bg-gray-50"
          >
            <Link
              href={`/blogs/${blog.id}`}
              className="text-blue-600 hover:underline font-medium"
            >
              {blog.title}
            </Link>{" "}
            <span className="text-gray-600">
              {blog.author} {blog.url} {blog.likes} likes
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs
