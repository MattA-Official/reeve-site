# Reeve website

The marketing and documentation site for Reeve, moderation for a single Discord community.

Built with Nuxt 4.6.4 and Bun in the Citation design (the bento citation layout). Every page is prerendered; only the beta sign-up API (`/api/beta`) runs on the server, with NuxtHub and Cloudflare D1.

## Getting started

You need [Bun](https://bun.sh) 1.4.4 and Node 24 (see `.nvmrc`).

```sh
bun install
bun run dev
```

| Command | What it does |
| --- | --- |
| `bun run dev` | Starts the dev server on http://localhost:3000 |
| `bun run lint` | ESLint, which also handles formatting |
| `bun run typecheck` | Vue and TypeScript type checks |
| `bun run test` | Unit and component tests (Vitest) |
| `bun run test:e2e` | Builds the site, then runs browser tests on the prerendered output at 1440px and 390px (Playwright) |
| `bun run build` | Prerenders the pages into `.output/public` and builds the `/api` server |
| `bun run check` | Lint, types, unit tests and the build, as CI runs them |

Set `NUXT_PUBLIC_SITE_URL` (see `.env.example`) once the domain is chosen. Until then the build uses `https://reeve.invalid`.

## Deploying

The site is built to run on Cloudflare Workers with a D1 database; there is no deploy workflow yet. Locally and in CI, NuxtHub uses a SQLite file in `.data/db/` instead.

1. Create a D1 database and set its ID as `NUXT_HUB_D1_DATABASE_ID`.
2. Build with `NITRO_PRESET=cloudflare_module bun run build`. The binding is called `DB`.
3. Apply the migrations to D1 before the new code goes live; deploying does not run them. The build copies them to `.output/server/db/migrations/sqlite/` and names them in `.output/server/wrangler.json`, so `wrangler d1 migrations apply DB --remote` run from `.output/server` applies them.
4. The `beta:purge` task runs daily at 03:00 UTC through the Cron Trigger the build declares, and deletes sign-up requests past their retention: 30 days after a place is offered or declined, and a year after the request at the latest.

### Closing a request

When a place is offered or a request is declined, set `closed_at` so the 30-day clock starts. From `.output/server`, with the server name and address from the request:

```sh
wrangler d1 execute DB --remote --command "UPDATE beta_requests SET closed_at = unixepoch() WHERE server = '…' AND email = '…'"
```

### Running somewhere other than Cloudflare

The rate limit on `/api/beta` keys on `CF-Connecting-IP` on Workers. Anywhere else it falls back to `X-Forwarded-For`, which a client can forge, so put the site behind a proxy that overwrites that header.

## Working with Claude Code

The repo is set up for agentic work:

- `CLAUDE.md`: the stack, commands, non-negotiables and working method.
- `.claude/rules/`: rules that load by path (components, styles, content, pages, tests).
- `.claude/agents/`: reviewers for design fidelity, accessibility, copy and privacy.
- `.claude/skills/`: our skills (`reeve-design-system`, `reeve-copy`, `page-from-board`) and vendored Nuxt and Vue skills (see `VENDORED.md`).
- `.claude/hooks/`: Bun-only installs with exact versions, no secrets, ESLint after every edit, and lint, types and tests before a session finishes.
- `.mcp.json`: the official Nuxt MCP server and Playwright MCP.
- `design/`: where the designs live and which boards each page is built from.
