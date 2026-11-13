import { describe, expect, it } from 'vitest'
import { isHoneypotFilled, parseBetaRequest, RETENTION, retentionCutoffs } from '../../server/utils/beta'

const valid = { server: '  The Reading Room ', role: 'admin', members: 'medium', email: ' Mod@Example.com ' }

describe('beta sign-up validation', () => {
  it('accepts a complete request and tidies it', () => {
    expect(parseBetaRequest(valid)).toEqual({ server: 'The Reading Room', role: 'admin', members: 'medium', email: 'mod@example.com' })
  })

  it.each([
    ['no body', null],
    ['a string body', 'server=x'],
    ['an empty server name', { ...valid, server: '   ' }],
    ['a server name over 100 characters', { ...valid, server: 'x'.repeat(101) }],
    ['an address without a domain', { ...valid, email: 'mod@' }],
    ['an address over 254 characters', { ...valid, email: `${'x'.repeat(250)}@a.bc` }],
    ['an unknown role', { ...valid, role: 'founder' }],
    ['an unknown size', { ...valid, members: 'huge' }],
    ['the hidden field filled in', { ...valid, website: 'https://spam.example' }],
  ])('refuses %s', (_, body) => {
    expect(parseBetaRequest(body)).toBeNull()
  })

  it('keeps only the four fields it asks for', () => {
    expect(Object.keys(parseBetaRequest({ ...valid, ip: '203.0.113.1', notes: 'x' }) ?? {})).toEqual(['server', 'role', 'members', 'email'])
  })
})

describe('beta sign-up retention', () => {
  it('deletes 30 days after a place is offered or declined, and at most a year after the request', () => {
    const now = new Date('2027-06-01T03:00:00Z')
    const { closedBefore, createdBefore } = retentionCutoffs(now)
    expect(now.getTime() - closedBefore.getTime()).toBe(RETENTION.afterClose)
    expect(closedBefore.toISOString()).toBe('2027-05-02T03:00:00.000Z')
    expect(createdBefore.toISOString()).toBe('2026-06-01T03:00:00.000Z')
  })
})

describe('the honeypot', () => {
  it('is only set off by the hidden field', () => {
    expect(isHoneypotFilled({ ...valid, website: 'https://spam.example' })).toBe(true)
    expect(isHoneypotFilled({ ...valid, website: '' })).toBe(false)
    expect(isHoneypotFilled(valid)).toBe(false)
    expect(isHoneypotFilled(null)).toBe(false)
  })
})
