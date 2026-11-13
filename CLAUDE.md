# Reeve website

The marketing and documentation site for Reeve (codename Warden), moderation for a single Discord community.
Nuxt 4.6.4, Vue 3, TypeScript strict, Bun, Nuxt Content. Prerendered with `nuxt generate`.
British English everywhere: code comments, copy, docs, commit messages.

The look is **Citation**, laid out as the **bento citation** boards. Read `design/README.md` before building anything visual.

## Commands

| Task | Command |
| --- | --- |
| Install | `bun install --frozen-lockfile` |
| Dev server | `bun run dev` |
| Lint (ESLint does formatting too; there is no Prettier) | `bun run lint`, `bun run lint:fix` |
| Types | `bun run typecheck` |
| Unit and component tests (Vitest) | `bun run test` |
| Build, then browser tests on the prerendered site at 1440px and 390px (Playwright) | `bun run test:e2e` |
| Regenerate `app/assets/css/tokens.css` after `design/citation/tokens.json` changes | `bun run tokens` |
| Static build | `bun run generate` |
| Everything CI runs | `bun run check` |

Use Bun for every install and script. Never `npm`, `pnpm` or `yarn`. `bunfig.toml` pins exact versions on `bun add`.
Bun's own test runner can't host Nuxt component tests, so `bun run test` runs Vitest.

## Stack

| Concern | Choice |
| --- | --- |
| Content | `@nuxt/content` collections per locale (`content.config.ts`), SQLite at build time |
| Strings | `@nuxtjs/i18n`, en-GB first, locale files in `i18n/locales/` |
| Fonts | `@nuxt/fonts`, downloaded at build time and served from the site, never from Google at runtime |
| SEO | `@nuxtjs/seo` (sitemap, robots, Schema.org, link checker; OG images off until the pages exist) |
| Agents | `nuxt-llms` builds `/llms.txt` from the docs |
| Security | `nuxt-security` headers and CSP |
| Dev checks | `@nuxt/a11y` (axe-core, plus a report on every prerendered route), `@nuxt/hints` |
| Styling | Plain CSS from the Citation tokens. No UI kit, no Tailwind, no CSS-in-JS |

Later, when a page needs them: `@nuxt/scripts` (Stripe.js), `@nuxtjs/mcp-toolkit` (a docs MCP server), `nuxt-agent-discovery`, `@nuxthub/core` (the dashboard).

## Non-negotiables

- **Tokens only.** Colours, spacing, radii, type sizes and motion come from the Citation tokens. Never a raw hex, px value or font name in a component.
- **Built from the design.** Every component maps to a Citation component or a board. If the design lacks something, ask; don't invent a look.
- **Dark only.** Citation has one theme. No colour-mode switch.
- **Accessible.** WCAG 2.2 AA: 4.5:1 text (3:1 at 24px and up), 44px targets (36px in dense lists), a 3px focus outline with a 2px offset, state in ARIA attributes, reduced motion honoured. Status is written in words; colour is never the only signal.
- **Copy.** UI strings live in `i18n/locales/`, long-form copy in `content/`. No copy as string literals in components. Follow `design/README.md`: no emoji, no exclamation marks, sentence case, buttons as a verb and an object, bracketed citations, "£24 a month", VAT note on every price, "Planned" for undecided prices before launch. Design placeholders (`[date]`, `£[price]`, `[COMPANY NAME]`) never ship.
- **Claims match the bot.** AI may only delete a message, hold back an attachment, or time a member out for up to an hour, and a person can undo each one. Member-facing rule references are public numbers only (`3`, never `3.2.a`). Check claims against the Warden repo, not memory.
- **Privacy.** No third-party request from a page (fonts, analytics, embeds, scripts) without a privacy review, and the privacy page must match what the site does.
- **Secrets** come from environment variables only. Never print, log or commit them. `NUXT_PUBLIC_SITE_URL` sets the domain; until it is chosen the build uses `https://reeve.invalid`.
- **Versions** are pinned exactly. Don't upgrade a dependency as a side effect of other work.

## Working method

1. Plan first. Name the board(s) the page comes from and the components it needs.
2. Build one page at a time with the `page-from-board` skill.
3. Run the `design-fidelity-reviewer`, `a11y-auditor` and `copy-reviewer` subagents on the diff. Add `privacy-reviewer` when anything loads from outside the site, sets a cookie, or changes the privacy or legal pages.
4. `bun run check` must pass. The Stop hook runs lint, typecheck and unit tests when source files change.
5. Push only to your own `claude/*` branch and open a PR. Never push to `main`.

## Where to look

- Brand book and tokens: `design/README.md`, `design/citation/`.
- Live sources: the design system and the site design canvas (links in `design/README.md`).
- Nuxt docs: the `nuxt` MCP server in `.mcp.json` (current docs, modules, changelog). Prefer it over memory.
- Skills: `reeve-design-system`, `reeve-copy`, `page-from-board` (ours); `nuxt`, `vue`, `vitest`, `vue-best-practices`, `vue-testing-best-practices`, `vue-debug-guides`, `nuxt-content`, `nuxt-i18n`, `nuxt-seo` (vendored, see `.claude/skills/VENDORED.md`).
- Path-specific rules load from `.claude/rules/`.
