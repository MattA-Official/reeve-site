import type { Page } from '@playwright/test'

// Opens a page and waits until Vue has mounted, so a click reaches the app and not the bare server HTML.
// Vue marks its container with __vue_app__ once mounting is done.
export async function gotoHydrated(page: Page, path: string): Promise<void> {
  await page.goto(path)
  await page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as { __vue_app__?: unknown } | null)?.__vue_app__))
}
