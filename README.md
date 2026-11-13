# Reeve website

The marketing and documentation site for Reeve, moderation for a single Discord community.

Built with Nuxt 4.6.4 and Bun, prerendered to static files, in the Citation design (the bento citation layout).

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
| `bun run generate` | Builds the static site into `.output/public` |
| `bun run check` | Lint, types, unit tests and the static build, as CI runs them |

Set `NUXT_PUBLIC_SITE_URL` (see `.env.example`) once the domain is chosen. Until then the build uses `https://reeve.invalid`.

## Working with Claude Code

The repo is set up for agentic work:

- `CLAUDE.md`: the stack, commands, non-negotiables and working method.
- `.claude/rules/`: rules that load by path (components, styles, content, pages, tests).
- `.claude/agents/`: reviewers for design fidelity, accessibility, copy and privacy.
- `.claude/skills/`: our skills (`reeve-design-system`, `reeve-copy`, `page-from-board`) and vendored Nuxt and Vue skills (see `VENDORED.md`).
- `.claude/hooks/`: Bun-only installs with exact versions, no secrets, ESLint after every edit, and lint, types and tests before a session finishes.
- `.mcp.json`: the official Nuxt MCP server and Playwright MCP.
- `design/`: where the designs live and which boards each page is built from.
