import { describe, expect, it } from 'vitest'
import enGB from '../../i18n/locales/en-GB.json'

const strings = (value: unknown): string[] =>
  typeof value === 'string'
    ? [value]
    : Object.values(value as Record<string, unknown>).flatMap(strings)

describe('en-GB locale', () => {
  it('ships no design-stage placeholders', () => {
    for (const text of strings(enGB)) {
      expect(text).not.toMatch(/\[(date|n|price|COMPANY NAME)\]|£\[/)
    }
  })

  it('uses no exclamation marks', () => {
    for (const text of strings(enGB)) {
      expect(text).not.toContain('!')
    }
  })
})
