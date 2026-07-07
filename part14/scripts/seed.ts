import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })
dotenv.config({ path: ".env" })

const seed = async () => {
  const { db } = await import("../db")
  const { blogs, users } = await import("../db/schema")

  const existingUsers = await db.query.users.findMany()

  let userId: number

  if (existingUsers.length === 0) {
    const [user] = await db
      .insert(users)
      .values({
        username: "mluukkai",
        name: "Matti Luukkainen",
      })
      .returning()

    userId = user.id
  } else {
    userId = existingUsers[0].id
  }

  const existingBlogs = await db.query.blogs.findMany()

  if (existingBlogs.length === 0) {
    await db.insert(blogs).values([
      {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com",
        likes: 7,
        userId,
      },
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        userId,
      },
      {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        userId,
      },
    ])
  }

  console.log("Seed completed")
  process.exit(0)
}

void seed()
