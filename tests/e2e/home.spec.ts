import { expect, test } from '@nuxt/test-utils/playwright'

test('home page has one heading and the right language', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reeve')
})
