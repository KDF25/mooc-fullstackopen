import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <BlogForm createBlog={createBlog} />
    </MemoryRouter>,
  )

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByRole('button', { name: 'create' })

  await user.type(inputs[0], 'Test title')
  await user.type(inputs[1], 'Test author')
  await user.type(inputs[2], 'https://test.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test title',
    author: 'Test author',
    url: 'https://test.com',
  })
})
