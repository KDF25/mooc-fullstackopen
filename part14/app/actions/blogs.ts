"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { addBlog, incrementLikes } from "../services/blogs"
import {
  addToReadingList,
  markAsRead,
} from "../services/readingList"
import { generateTokenForUser } from "../services/users"
import { getCurrentUser } from "../services/session"
import type { CreateBlogState } from "./blogs.types"

export const createBlog = async (
  prevState: CreateBlogState,
  formData: FormData,
): Promise<CreateBlogState> => {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const title = (formData.get("title") as string) ?? ""
  const author = (formData.get("author") as string) ?? ""
  const url = (formData.get("url") as string) ?? ""
  const values = { title, author, url }
  const errors: NonNullable<CreateBlogState["errors"]> = {}

  if (!title || title.length < 5) {
    errors.title = "Title must be at least 5 characters long"
  }
  if (!author || author.length < 5) {
    errors.author = "Author must be at least 5 characters long"
  }
  if (!url || url.length < 5) {
    errors.url = "URL must be at least 5 characters long"
  }

  if (Object.keys(errors).length > 0) {
    return { error: "", success: false, errors, values }
  }

  await addBlog(title, author, url)
  revalidatePath("/blogs")
  return { error: "", success: true, values }
}

export const likeBlog = async (formData: FormData) => {
  const id = Number(formData.get("id"))
  await incrementLikes(id)
  revalidatePath(`/blogs/${id}`)
  revalidatePath("/blogs")
}

export const addToReadingListAction = async (blogId: number) => {
  await addToReadingList(blogId)
  revalidatePath(`/blogs/${blogId}`)
  revalidatePath("/me")
}

export const markAsReadAction = async (readingListId: number) => {
  await markAsRead(readingListId)
  revalidatePath("/me")
}

export const generateToken = async (_nonce?: number) => {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const token = await generateTokenForUser(user.id)
  revalidatePath("/me")
  return token
}
