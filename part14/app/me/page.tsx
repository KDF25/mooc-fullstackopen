import { redirect } from "next/navigation"
import { getCurrentUser } from "../services/session"
import { getReadingListForUser } from "../services/readingList"
import { markAsReadAction } from "../actions/blogs"
import ApiTokenSection from "../components/ApiTokenSection"

export const dynamic = "force-dynamic"

const MePage = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const readingListItems = await getReadingListForUser(user.id)
  const unreadItems = readingListItems.filter((item) => !item.read)
  const readItems = readingListItems.filter((item) => item.read)

  return (
    <div className="max-w-2xl mx-auto">
      <div data-testid="user-profile" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My profile</h2>
        <p data-testid="user-name" className="mb-1">
          Name: {user.name}
        </p>
        <p data-testid="user-username" className="mb-1">
          Username: {user.username}
        </p>
      </div>

      <ApiTokenSection initialToken={user.token} userName={user.name} />

      <div data-testid="reading-list-section">
        <h3 className="text-xl font-semibold mb-4">Reading list</h3>
        {readingListItems.length === 0 ? (
          <p data-testid="empty-reading-list" className="text-gray-600">
            Your reading list is empty
          </p>
        ) : (
          <>
            <div data-testid="unread-section" className="mb-6">
              <h4 className="font-semibold mb-2">Unread</h4>
              {unreadItems.length === 0 ? (
                <p data-testid="no-unread-blogs" className="text-gray-600">
                  No unread blogs
                </p>
              ) : (
                <ul className="space-y-2">
                  {unreadItems.map((item) => (
                    <li
                      key={item.id}
                      className="border rounded p-3 flex items-center justify-between"
                    >
                      <span>{item.blog.title}</span>
                      <form action={markAsReadAction.bind(null, item.id)}>
                        <button
                          type="submit"
                          data-testid={`mark-read-${item.id}`}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          mark as read
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div data-testid="read-section">
              <h4 className="font-semibold mb-2">Read</h4>
              {readItems.length === 0 ? (
                <p className="text-gray-600">No read blogs</p>
              ) : (
                <ul className="space-y-2">
                  {readItems.map((item) => (
                    <li key={item.id} className="border rounded p-3">
                      {item.blog.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MePage
