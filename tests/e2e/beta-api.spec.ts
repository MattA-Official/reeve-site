import { expect, test } from '@playwright/test'

// The sign-up API on the built server. Each project sends two requests, well inside the rate limit of five.
test('the beta API stores a valid request and turns away a bad one', async ({ request }, testInfo) => {
  const ok = await request.post('/api/beta', {
    data: { server: `E2E ${testInfo.project.name}`, role: 'owner', members: 'small', email: 'e2e@example.com', website: '' },
  })
  expect(ok.status()).toBe(201)
  expect(await ok.json()).toEqual({ ok: true })

  const bad = await request.post('/api/beta', { data: { server: '', role: 'king', members: 'small', email: 'nope' } })
  expect(bad.status()).toBe(400)
})
