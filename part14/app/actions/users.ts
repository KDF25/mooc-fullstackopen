"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "../../db"
import { users } from "../../db/schema"
import type { RegisterState } from "./users.types"

export const registerUser = async (
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> => {
  const username = (formData.get("username") as string)?.trim()
  const name = (formData.get("name") as string)?.trim()
  const password = formData.get("password") as string
  const passwordConfirm = formData.get("passwordConfirm") as string

  const values = { username, name, password, passwordConfirm }
  const errors: RegisterState["errors"] = {}

  if (!username || username.length < 4) {
    errors.username = "Username must be at least 4 characters long"
  }

  if (!password || password.length < 4) {
    errors.password = "Password must be at least 4 characters long"
  }

  if (password !== passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match"
  }

  if (username && username.length >= 4) {
    const existing = await db.query.users.findFirst({
      where: eq(users.username, username),
    })
    if (existing) {
      errors.username = "Username already taken"
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await db.insert(users).values({ username, name, passwordHash })

  redirect("/login")
}
