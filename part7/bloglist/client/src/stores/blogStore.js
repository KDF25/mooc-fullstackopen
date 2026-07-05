import { create } from 'zustand'
import blogService from '../services/blogs'
import { useNotificationStore } from './notificationStore'
import { useUserStore } from './userStore'

export const useBlogStore = create((set, get) => ({
  blogs: [],
  initialize: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },
  createBlog: async (blogObject) => {
    const user = useUserStore.getState().user
    const returnedBlog = await blogService.create(blogObject)
    set({
      blogs: get().blogs.concat({
        ...returnedBlog,
        user: { username: user.username, name: user.name, id: user.id },
      }),
    })
    useNotificationStore.getState().setNotification({
      text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      type: 'success',
    })
  },
  likeBlog: async (id) => {
    const blog = get().blogs.find((b) => b.id === id)
    const userId = blog.user.id || blog.user
    const changedBlog = {
      user: userId,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    const returnedBlog = await blogService.update(id, changedBlog)
    set({ blogs: get().blogs.map((b) => (b.id !== id ? b : returnedBlog)) })
  },
  removeBlog: async (id, navigate) => {
    const blog = get().blogs.find((b) => b.id === id)
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(id)
      set({ blogs: get().blogs.filter((b) => b.id !== id) })
      navigate('/')
    }
  },
  addComment: async (id, content) => {
    const updatedBlog = await blogService.createComment(id, content)
    set({ blogs: get().blogs.map((b) => (b.id !== id ? b : updatedBlog)) })
  },
}))
