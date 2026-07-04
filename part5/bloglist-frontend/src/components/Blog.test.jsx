import { render, screen } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Test title',
  author: 'Test author',
  url: 'https://test.com',
  likes: 0,
  user: {
    username: 'root',
    name: 'Superuser',
  },
  id: '1',
}

test('blog information is shown to unauthenticated users without buttons', () => {
  render(
    <Blog blog={blog} user={null} handleLike={() => {}} handleRemove={() => {}} />,
  )

  screen.getByText('Test title')
  screen.getByText('Test author')
  screen.getByText('https://test.com')
  screen.getByText('likes 0')
  expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('authenticated non-creator sees only the like button', () => {
  const otherUser = { username: 'other', name: 'Other User' }

  render(
    <Blog
      blog={blog}
      user={otherUser}
      handleLike={() => {}}
      handleRemove={() => {}}
    />,
  )

  screen.getByRole('button', { name: 'like' })
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('blog creator sees like and remove buttons', () => {
  const creator = { username: 'root', name: 'Superuser' }

  render(
    <Blog
      blog={blog}
      user={creator}
      handleLike={() => {}}
      handleRemove={() => {}}
    />,
  )

  screen.getByRole('button', { name: 'like' })
  screen.getByRole('button', { name: 'remove' })
})
