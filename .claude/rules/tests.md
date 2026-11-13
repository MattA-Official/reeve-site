---
paths:
  - "tests/**"
  - "vitest.config.ts"
  - "playwright.config.ts"
---

# Tests

- `tests/unit/` runs in plain Node (fast, no Nuxt). `tests/nuxt/` runs in the Nuxt environment with `mountSuspended`. `tests/e2e/` runs plain Playwright against the built server (`node .output/server/index.mjs`), which serves the prerendered pages and the `/api` routes.
- Query by role and accessible name (`getByRole('button', { name: 'Join the beta' })`), not by class or test id, so the tests double as accessibility checks.
- Every page gets an e2e test in both projects (`desktop` 1440px, `phone` 390px).
- Never skip, disable or loosen a test to get green.
- Run tests with `bun run test` and `bun run test:e2e` (which builds the site, then tests the prerendered output), never `bun test` (Bun's runner can't host Nuxt tests).
