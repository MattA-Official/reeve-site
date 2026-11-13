import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// app.config.ts uses Nuxt's defineAppConfig, which is a plain identity function outside Nuxt.
;

(globalThis as Record<string, unknown>).defineAppConfig = (config: unknown) => config
const { default: appConfig } = await import('../../app/app.config')

describe('site settings', () => {
  it('collects sign-ups only with a privacy page, a named controller and a contact address', () => {
    const { reeve } = appConfig
    if (!reeve.betaSignup) return
    expect(reeve.builtPages).toContain('/privacy')
    // The page itself has to exist, not just the link to it.
    const root = resolve(__dirname, '../..')
    expect(['app/pages/privacy.vue', 'content/en-GB/privacy.md'].some(file => existsSync(resolve(root, file)))).toBe(true)
    expect(reeve.privacy.controller.trim()).not.toBe('')
    expect(reeve.privacy.contact.trim()).toMatch(/@/)
  })
})
