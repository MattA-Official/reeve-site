import { expect, test } from '@playwright/test'
import { gotoHydrated } from './hydrated'

test('how it works has one heading, its title, and a contents list that jumps to each section', async ({ page }) => {
  await page.goto('/how-it-works')
  await expect(page).toHaveTitle('How it works | Reeve')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How Reeve handles moderation')
  const contents = page.getByRole('navigation', { name: 'On this page' })
  await expect(contents.getByRole('link')).toHaveText(['From report to review', 'What members see', 'Tickets', 'For your team'])
  await contents.getByRole('link', { name: 'Tickets' }).click()
  await expect(page).toHaveURL(/#tickets$/)
  await expect(page.getByRole('heading', { level: 2, name: 'Tickets', exact: true })).toBeInViewport()
})

test('the header links to the page and marks it as current', async ({ page, isMobile }) => {
  await page.goto('/how-it-works')
  const banner = page.getByRole('banner')
  if (isMobile) await banner.getByRole('button', { name: 'Menu' }).click()
  await expect(banner.getByRole('link', { name: 'How it works' })).toHaveAttribute('aria-current', 'page')
})

test('a step turns over and Escape turns it back', async ({ page }) => {
  await gotoHydrated(page, '/how-it-works')
  await page.getByRole('button', { name: /^Appeal/ }).click()
  const back = page.getByRole('region', { name: 'Appeal: how it works' })
  await expect(back.getByRole('listitem')).toHaveCount(4)
  await expect(back).toContainText('Kicks can\'t')
  await expect(page.getByRole('button', { name: 'Close Appeal' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('[aria-controls="bento-back-appeal"]')).toHaveAttribute('aria-expanded', 'false')
})

test('the view switch shows what the member sees, then what the team sees', async ({ page }) => {
  await gotoHydrated(page, '/how-it-works')
  const views = page.getByRole('group', { name: 'Choose a view' })
  const member = views.getByRole('button', { name: 'What the member sees' })
  const staff = views.getByRole('button', { name: 'What your team sees' })
  await expect(member).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByText('You have been timed out in The Reading Room')).toBeVisible()
  await staff.click()
  await expect(staff).toHaveAttribute('aria-pressed', 'true')
  await expect(member).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByText('Case #1043 — Timeout (in force)')).toBeVisible()
  await expect(page.getByText('@alex')).toBeVisible()
})

test('nothing on the page scrolls sideways', async ({ page }) => {
  await page.goto('/how-it-works')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBe(0)
})

test('Escape closes an open step even after focus has moved on, and leaves focus where it is', async ({ page }) => {
  await gotoHydrated(page, '/how-it-works')
  await page.getByRole('button', { name: /^Report/ }).click()
  const front = page.locator('[aria-controls="bento-back-report"]')
  await expect(front).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('button', { name: 'Close Report' })).toBeFocused()
  await page.keyboard.press('Tab')
  const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-controls'))
  await page.keyboard.press('Escape')
  await expect(front).toHaveAttribute('aria-expanded', 'false')
  expect(await page.evaluate(() => document.activeElement?.getAttribute('aria-controls'))).toBe(focused)
})
