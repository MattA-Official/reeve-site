import { expect, test } from '@playwright/test'

test('home page has one heading, the right language and its own title', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
  await expect(page).toHaveTitle('Reeve')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reeve')
})

test('unknown pages return the 404 page', async ({ page }) => {
  const response = await page.goto('/no-such-page')
  expect(response?.status()).toBe(404)
})
