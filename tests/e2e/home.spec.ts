import { expect, test } from '@playwright/test'

test('home page has one heading, the right language and its own title', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
  await expect(page).toHaveTitle('Reeve: Discord moderation that records every action')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A Discord moderation bot that records every action and tells members why.')
})

test('a card turns over, moves focus to its close button, and Escape turns it back', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /^Cases/ }).click()
  // An open card's front is inert, so it leaves the accessibility tree; find it by what it controls.
  const front = page.locator('[aria-controls="bento-back-cases"]')
  await expect(front).toHaveAttribute('aria-expanded', 'true')
  const back = page.getByRole('region', { name: 'Cases: how it works' })
  await expect(back.getByRole('listitem')).toHaveCount(4)
  await expect(page.getByRole('button', { name: 'Close Cases' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(front).toHaveAttribute('aria-expanded', 'false')
  await expect(front).toBeFocused()
})

test('the grid keeps its height when a card opens on wide screens', async ({ page, isMobile }) => {
  test.skip(isMobile, 'On phones the open card grows the grid by design.')
  await page.goto('/')
  const grid = page.getByRole('region', { name: 'What Reeve does' })
  const before = await grid.boundingBox()
  await page.getByRole('button', { name: /^AI moderation/ }).click()
  await page.waitForTimeout(700)
  expect((await grid.boundingBox())?.height).toBeCloseTo(before?.height ?? 0, 0)
})

test('Join the beta opens the beta card, which collects nothing until sign-up opens', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Join the beta', exact: true }).click()
  const back = page.getByRole('region', { name: 'Join the beta' })
  await expect(back.getByText('We\'re opening Reeve to a few servers at a time')).toBeVisible()
  await expect(back.getByRole('textbox')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Close Join the beta' })).toBeFocused()
})

test('unknown pages return the 404 page', async ({ page }) => {
  const response = await page.goto('/no-such-page')
  expect(response?.status()).toBe(404)
})
