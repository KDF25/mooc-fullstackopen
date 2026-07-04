const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'secret',
      },
    })
    await page.goto('/')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'root', 'secret')
      await expect(page.getByRole('link', { name: 'create new blog' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'root', 'wrong')
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'secret')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'a blog created by playwright',
        author: 'Playwright Author',
        url: 'https://playwright.dev',
      })
      await expect(page.getByRole('link', { name: 'a blog created by playwright' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, {
        title: 'likeable blog',
        author: 'Author',
        url: 'https://example.com',
      })
      await page.getByRole('link', { name: 'likeable blog' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted by the user who added it', async ({ page }) => {
      page.on('dialog', dialog => dialog.accept())
      await createBlog(page, {
        title: 'deletable blog',
        author: 'Author',
        url: 'https://example.com',
      })
      await page.getByRole('link', { name: 'deletable blog' }).click()
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByRole('link', { name: 'deletable blog' })).not.toBeVisible()
    })
  })
})
