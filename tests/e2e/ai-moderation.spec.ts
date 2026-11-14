import { expect, test } from '@playwright/test'
import { gotoHydrated } from './hydrated'

test('AI moderation has one heading, its title, and a contents list that jumps to each section', async ({ page }) => {
  await page.goto('/ai-moderation')
  await expect(page).toHaveTitle('AI moderation | Reeve')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How Reeve uses AI')
  const contents = page.getByRole('navigation', { name: 'On this page' })
  await expect(contents.getByRole('link')).toHaveText([
    'The three stages', 'What AI may do alone', 'Override cards', 'What AI never does', 'How we check it',
  ])
  await contents.getByRole('link', { name: 'Override cards' }).click()
  await expect(page).toHaveURL(/#override$/)
  await expect(page.getByRole('heading', { level: 2, name: 'Override cards', exact: true })).toBeInViewport()
})

test('the header links to the page and marks it as current', async ({ page, isMobile }) => {
  await page.goto('/ai-moderation')
  const banner = page.getByRole('banner')
  if (isMobile) await banner.getByRole('button', { name: 'Menu' }).click()
  await expect(banner.getByRole('link', { name: 'AI moderation' })).toHaveAttribute('aria-current', 'page')
})

test('AI may only delete a message or time out for up to an hour, and never quarantines', async ({ page }) => {
  await page.goto('/ai-moderation')
  const may = page.getByRole('heading', { level: 3, name: 'What AI may do', exact: true }).locator('..')
  await expect(may.getByRole('listitem')).toHaveText(['Delete a message', /^Time the member out for up to one hour/])
  await expect(page.locator('main')).not.toContainText(/quarantine|Gemini|EEA/i)
})

test('the example shows the names the hosted model sees, then hides them again', async ({ page }) => {
  await gotoHydrated(page, '/ai-moderation')
  const toggle = page.getByRole('button', { name: 'Show what the model sees' })
  const example = page.getByRole('group', { name: 'An example of the names being hidden' })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(example).toBeHidden()
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(example).toContainText('[MEMBER_A]: you clearly didn\'t read it, as usual')
  await toggle.click()
  await expect(example).toBeHidden()
})

test('the override card buttons show what each decision does', async ({ page }) => {
  await gotoHydrated(page, '/ai-moderation')
  const buttons = page.getByRole('group', { name: 'Decide on this action' })
  const result = page.getByRole('status').filter({ hasText: 'Waiting for review' })
  await expect(result).toBeVisible()
  const reverse = buttons.getByRole('button', { name: 'Reverse action' })
  await reverse.click()
  await expect(reverse).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('status').filter({ hasText: 'Reversed' })).toContainText('The timeout is lifted')
  const uphold = buttons.getByRole('button', { name: 'Uphold action' })
  await uphold.click()
  await expect(uphold).toHaveAttribute('aria-pressed', 'true')
  await expect(reverse).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByRole('status').filter({ hasText: 'Upheld' })).toBeVisible()
  await expect(page.getByText('LLM action #1051 · Rule 3 — Upheld', { exact: true })).toBeVisible()
})

test('nothing on the page scrolls sideways', async ({ page }) => {
  await page.goto('/ai-moderation')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBe(0)
})
