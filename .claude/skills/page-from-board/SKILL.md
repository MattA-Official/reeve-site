---
name: page-from-board
description: Step-by-step method for turning one bento citation board (desktop and phone) into a Nuxt page, then checking it against the board in Playwright. Use whenever starting a page or a page region.
---

# Page from board

One page per PR where possible. Work through the steps in order.

## 1. Read the boards

- Find the page's boards in `design/README.md`. Each page has a desktop board and a `-Phone` board; many have Soon and Live versions.
- Read them with the Artifact tool: `read` on https://claude.ai/artifact/JzT3GBY1rSf31Q24Pi2dKi with `paths: ["project/<Board>.dc.html", "project/<Board>-Phone.dc.html"]`. They are HTML with inline styles; the hex values and px sizes in them map to tokens in `design/citation/tokens.json`.
- List the page's regions top to bottom, and for each: the design-system component it uses, the grid spans at 1440px and at 390px, the card tones, and the copy.

## 2. Plan

- Name the components to reuse, the ones to port (see `reeve-design-system`), and any the design lacks (ask Matt before inventing one).
- Name the i18n keys and content files the copy needs (see `reeve-copy`).
- For Soon and Live boards, list what differs; both render from one site setting.

## 3. Build

- `app/pages/<route>.vue`, starting with a comment naming its boards.
- Compose from components; the page itself holds layout and data, not styling.
- Copy into `i18n/locales/en-GB.json` or `content/en-GB/`.
- `useSeoMeta` with title and description.

## 4. Test

- A Playwright test in `tests/e2e/<page>.spec.ts`: it runs in both the `desktop` (1440px) and `phone` (390px) projects. Check the `h1`, the main actions by role and name, and any interactive state (flip cards, menus, segmented controls).
- Component tests in `tests/nuxt/` for new components.

## 5. Compare and review

- Screenshot the page at 1440×900 and 390×844 (Playwright MCP or a test) and compare with the boards region by region.
- Run the `design-fidelity-reviewer`, `a11y-auditor` and `copy-reviewer` subagents; add `privacy-reviewer` if anything loads from outside the site.
- `bun run check` must pass.
- In the PR, name the boards, attach both screenshots, and list any difference from the board you kept on purpose, with the reason.
