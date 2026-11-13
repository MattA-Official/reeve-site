---
paths:
  - "app/pages/**"
---

# Pages

- Each page names its board(s) in a comment at the top of the file, for example `<!-- Boards: Site-Citation-Pricing-Soon, Site-Citation-Pricing-Live -->`.
- Set `useSeoMeta` with a title and description from i18n or content. One `h1` per page.
- Sections follow the brand book's shape: top padding, an `h2` with its `[n]`, an optional intro at `prose-measure`, then the content.
- Pages with Soon and Live boards render both states from one site setting; don't fork the page.
- Pages must prerender. Server work lives in `server/` (NuxtHub on Cloudflare): the beta sign-up API is there now; payment and the dashboard get their own PRs.
- Add a Playwright test for every page at 1440px and 390px.
