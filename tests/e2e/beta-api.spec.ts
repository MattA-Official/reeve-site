import { expect, test } from '@playwright/test'

// The sign-up API on the built server. It runs in the desktop project only and sends three requests, so a
// retry stays inside the rate limit.
test('the beta API stores a valid request and turns away a bad one', async ({ request }, testInfo) => {
  const ok = await request.post('/api/beta', {
    data: { server: `E2E ${testInfo.project.name}`, role: 'owner', members: 'small', email: 'e2e@example.com', trap: '' },
  })
  expect(ok.status()).toBe(201)
  expect(await ok.json()).toEqual({ ok: true })

  const bad = await request.post('/api/beta', { data: { server: '', role: 'king', members: 'small', email: 'nope' } })
  expect(bad.status()).toBe(400)

  // Another site's form can't sign anyone up.
  const crossSite = await request.post('/api/beta', {
    form: { server: 'Forged', role: 'owner', members: 'small', email: 'victim@example.com' },
    headers: { Origin: 'https://evil.example' },
  })
  expect(crossSite.status()).toBe(415)
})
