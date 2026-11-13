import { expect, test } from '@playwright/test'
import { gotoHydrated } from './hydrated'

test('home page has one heading, the right language and its own title', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
  await expect(page).toHaveTitle('Reeve: Discord moderation that records every action')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A Discord moderation bot that records every action and tells members why.')
})

test('a card turns over, moves focus to its close button, and Escape turns it back', async ({ page }) => {
  await gotoHydrated(page, '/')
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

// Wide: the grid keeps its footprint. Phone: the open card spans both columns and pushes the rest down.
// On both, no two items overlap.
test('opening a card keeps every item clear of the others', async ({ page, isMobile }) => {
  await gotoHydrated(page, '/')
  const grid = page.getByRole('region', { name: 'What Reeve does' })
  const before = await grid.boundingBox()
  await page.getByRole('button', { name: /^AI moderation/ }).click()
  await page.waitForTimeout(700)
  const after = await grid.boundingBox()
  if (isMobile) {
    expect(after?.height).toBeGreaterThan(before?.height ?? 0)
    const card = await page.locator('[data-card="ai"]').boundingBox()
    expect(card?.width).toBeCloseTo(after?.width ?? 0, 0)
  }
  else {
    expect(after?.height).toBeCloseTo(before?.height ?? 0, 0)
  }
  const boxes = await page.locator('[data-card]').evaluateAll(els => els.map(el => el.getBoundingClientRect().toJSON()))
  for (const [i, a] of boxes.entries()) {
    for (const b of boxes.slice(i + 1)) {
      const overlap = a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1
      expect(overlap).toBe(false)
    }
  }
})

test('no card front needs to scroll at this width, even before scripts run', async ({ browser, isMobile }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto('/')
  const overflowing = await page.locator('.rv-flip-front').evaluateAll(els =>
    els.filter(el => el.scrollHeight > el.clientHeight + 1).map(el => el.getAttribute('data-front')))
  expect(overflowing).toEqual([])
  await context.close()
})

test('the hero opens the beta card, which collects nothing until sign-up opens', async ({ page }) => {
  await gotoHydrated(page, '/')
  await page.getByRole('button', { name: 'Read about the beta', exact: true }).click()
  const back = page.getByRole('region', { name: 'The private beta' })
  await expect(back.getByText('We\'re opening Reeve to a few servers at a time')).toBeVisible()
  await expect(back.getByText('Requests open here soon.')).toBeVisible()
  await expect(back.getByRole('textbox')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Close The private beta' })).toBeFocused()
})

test('unknown pages return the 404 page', async ({ page }) => {
  const response = await page.goto('/no-such-page')
  expect(response?.status()).toBe(404)
})
