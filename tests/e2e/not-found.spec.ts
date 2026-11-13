import { expect, test } from '@playwright/test'

test('an unknown page answers 404 with the not-found page', async ({ page }) => {
  const response = await page.goto('/no-such-page')
  expect(response?.status()).toBe(404)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
  await expect(page).toHaveTitle('This page isn\'t here | Reeve')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page isn\'t here')
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
})

test('the not-found page links only to pages that exist', async ({ page }) => {
  await page.goto('/no-such-page')
  const main = page.getByRole('main')
  await expect(main.getByRole('heading', { level: 2 })).toHaveText(['Start again'])
  await main.getByRole('link', { name: 'Go home' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A Discord moderation bot that records every action and tells members why.')
})
