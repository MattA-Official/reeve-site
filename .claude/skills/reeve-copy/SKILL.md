---
name: reeve-copy
description: How to write and place copy for the Reeve website — voice, British English, buttons, prices, AI and rule claims, i18n keys and content files. Use when writing or changing any words a visitor will read.
---

# Reeve copy

The voice rules are the brand book's Content fundamentals (`design/citation/README.md`). This skill adds where copy lives and how to check it.

## Where copy lives

| Kind | Place | Example |
| --- | --- | --- |
| Short UI strings: nav, buttons, labels, card titles, form errors | `i18n/locales/en-GB.json`, read with `useI18n().t()` | `nav.pricing`, `home.hero.cta` |
| Long-form pages: docs, changelog, legal, privacy | `content/en-GB/...` Markdown with `title` and `description` frontmatter | `content/en-GB/docs/configuration.md` |
| Page metadata | the page's `useSeoMeta`, from i18n keys | `pricing.meta.description` |

Keys are nested by page, then region: `pricing.plans.community.price`. Never put copy in a `.vue` file. When the boards show copy, take it from the board, then check it against the rules below; a board's square-bracket placeholders become i18n keys with real text or wait for Matt.

## The rules, quickly

1. British English. Dates 14 March 2026. 24-hour times.
2. Plain and calm. Short sentences. No exclamation marks, superlatives, urgency or emoji.
3. Sentence case. Mono labels lowercase and bracketed: `[on this page]`.
4. "We" the company, "you" the owner or moderator, "members" the community. Name who acts.
5. Buttons are a verb and an object: "Join the beta", "Add to Discord", "Compare plans in full".
6. Status in words: `[working]`, "Paused once in the last 60 days".
7. Money: "£24 a month", "£240 a year", plus "Prices exclude VAT, which is added at checkout where it applies." Before launch, undecided prices read "Planned".
8. AI: what the model sees (names, user IDs, mentions and profile links are replaced first), the three things it may do alone (delete a message, hold back an attachment, time a member out for up to an hour), and that a person can undo each.
9. Rules: public numbers only.

## Checking claims

Product claims must match what Warden does today. When a page describes a feature, check it in the Warden repo (`MattA-Official/warden`: `docs/`, the roadmap, and `CLAUDE.md`'s non-negotiables). If you can't confirm a claim, leave it out and say so in the PR.

## Before you finish

- `bun run test` runs the locale checks (no placeholders, no exclamation marks).
- Run the `copy-reviewer` subagent on the diff.
