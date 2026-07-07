"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  createBlog,
} from "../../actions/blogs"
import { createBlogInitialState } from "../../actions/blogs.types"
import { useNotification } from "../../components/NotificationContext"

const NewBlog = () => {
  const [state, formAction] = useActionState(createBlog, createBlogInitialState)
  const { showNotification } = useNotification()
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      showNotification("blog created")
      router.push("/blogs")
    }
  }, [state, showNotification, router])

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create a new blog</h2>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            defaultValue={state.values?.title}
            className="w-full border rounded px-3 py-2"
          />
          {state.errors?.title && (
            <p className="text-red-600 text-sm mt-1">{state.errors.title}</p>
          )}
        </div>
        <div>
          <label htmlFor="author" className="block mb-1 font-medium">
            Author
          </label>
          <input
            id="author"
            type="text"
            name="author"
            defaultValue={state.values?.author}
            className="w-full border rounded px-3 py-2"
          />
          {state.errors?.author && (
            <p className="text-red-600 text-sm mt-1">{state.errors.author}</p>
          )}
        </div>
        <div>
          <label htmlFor="url" className="block mb-1 font-medium">
            URL
          </label>
          <input
            id="url"
            type="text"
            name="url"
            defaultValue={state.values?.url}
            className="w-full border rounded px-3 py-2"
          />
          {state.errors?.url && (
            <p className="text-red-600 text-sm mt-1">{state.errors.url}</p>
          )}
        </div>
        <button
          type="submit"
          data-testid="create-blog-button"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
        >
          Create
        </button>
        {state.error && <p className="text-red-600">{state.error}</p>}
      </form>
    </div>
  )
}

export default NewBlog
