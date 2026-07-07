import { and, eq } from "drizzle-orm"
import { db } from "../../db"
import { readingList } from "../../db/schema"
import { getCurrentUser } from "./session"

export const getReadingListForUser = async (userId: number) => {
  return db.query.readingList.findMany({
    where: eq(readingList.userId, userId),
    with: { blog: true },
  })
}

export const addToReadingList = async (blogId: number) => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Not logged in")
  }

  const existing = await db.query.readingList.findFirst({
    where: and(
      eq(readingList.userId, user.id),
      eq(readingList.blogId, blogId),
    ),
  })

  if (existing) {
    return
  }

  await db.insert(readingList).values({
    userId: user.id,
    blogId,
    read: false,
  })
}

export const markAsRead = async (readingListId: number) => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Not logged in")
  }

  await db
    .update(readingList)
    .set({ read: true })
    .where(
      and(
        eq(readingList.id, readingListId),
        eq(readingList.userId, user.id),
      ),
    )
}
