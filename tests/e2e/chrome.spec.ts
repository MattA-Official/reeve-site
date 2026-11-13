import { expect, test } from '@playwright/test'

test('the page has the site header and footer landmarks', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toContainText('Reeve is not affiliated with Discord Inc.')
  await expect(page.getByRole('link', { name: 'Reeve home' }).first()).toHaveAttribute('href', '/')
})

// Until the first pages are built the header has no links, so there is no Menu button to test here;
// tests/nuxt/site-chrome.test.ts covers the menu.
test('the header shows the private beta badge only on wide screens', async ({ page, isMobile }) => {
  await page.goto('/')
  const badge = page.getByRole('banner').getByText('private beta')
  if (isMobile) await expect(badge).toBeHidden()
  else await expect(badge).toBeVisible()
})

test('fonts and styles come from the site itself', async ({ page, baseURL }) => {
  const outside: string[] = []
  page.on('request', (request) => {
    if (!request.url().startsWith(baseURL ?? '') && !request.url().startsWith('data:')) outside.push(request.url())
  })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const families = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))
  expect(families.join()).toContain('Atkinson Hyperlegible')
  expect(families.join()).toContain('Spline Sans Mono')
  expect(outside).toEqual([])
})
