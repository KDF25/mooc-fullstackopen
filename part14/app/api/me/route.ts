import { NextRequest, NextResponse } from "next/server"
import { getUserByToken } from "../../services/users"

export const GET = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.slice(7)
  const user = await getUserByToken(token)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    username: user.username,
    name: user.name,
  })
}
