"use client"

import { useSession, signOut } from "next-auth/react"
import NavLink from "./NavLink"

const NavBar = () => {
  const { data: session } = useSession()

  return (
    <nav
      role="navigation"
      className="bg-gray-800 text-white px-6 py-3 flex items-center gap-4"
    >
      <NavLink href="/">home</NavLink>
      <NavLink href="/blogs">blogs</NavLink>
      <NavLink href="/users">users</NavLink>
      <div className="ml-auto flex items-center gap-4">
        {session ? (
          <>
            <NavLink href="/blogs/new">create new</NavLink>
            <NavLink href="/me">me</NavLink>
            <em className="text-gray-300">{session.user?.name} logged in</em>
            <button
              onClick={() => signOut()}
              className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
            >
              logout
            </button>
          </>
        ) : (
          <>
            <NavLink href="/login">login</NavLink>
            <NavLink href="/register">register</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar
