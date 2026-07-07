import { notFound } from "next/navigation"
import { getBlogById } from "../../services/blogs"
import { likeBlog, addToReadingListAction } from "../../actions/blogs"
import { getCurrentUser } from "../../services/session"

const BlogPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const blog = await getBlogById(Number(id))
  const currentUser = await getCurrentUser()

  if (!blog) {
    notFound()
  }

  const showAddToReadingList =
    currentUser && blog.userId !== currentUser.id

  const addAction = addToReadingListAction.bind(null, blog.id)

  return (
    <div
      data-testid="blog-detail"
      className="max-w-2xl mx-auto border rounded p-6"
    >
      <h2 data-testid="blog-title" className="text-2xl font-bold mb-2">
        {blog.title}
      </h2>
      <p data-testid="blog-author" className="text-gray-700 mb-2">
        {blog.author}
      </p>
      <p className="mb-2">
        <a href={blog.url} className="text-blue-600 hover:underline">
          {blog.url}
        </a>
      </p>
      <p className="mb-4">{blog.likes} likes</p>
      <form action={likeBlog} className="mb-4">
        <input type="hidden" name="id" value={blog.id} />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          like
        </button>
      </form>
      {showAddToReadingList && (
        <form action={addAction}>
          <button
            type="submit"
            data-testid="add-to-reading-list-button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            add to reading list
          </button>
        </form>
      )}
    </div>
  )
}

export default BlogPage
