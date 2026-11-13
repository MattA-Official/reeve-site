# Design sources

The site is built from two designs. Both are private claude.ai artifacts owned by Matt; read them with the Artifact tool, not a web fetch.

| Source | Link | What it holds |
| --- | --- | --- |
| Reeve Design System (Citation) | https://claude.ai/artifact/2SYz8HQaYonykMZ3CwqxNR | Brand book, tokens, logos, and components with previews (`project/components/<Name>/`), plus `components/bundle.css` |
| Site design canvas | https://claude.ai/artifact/JzT3GBY1rSf31Q24Pi2dKi | The page boards, as `.dc.html` files under `project/` |

## Which boards to build from

The chosen design is **bento citation**. Build from these boards and ignore the Ledger, Plumb and Tally variants, which were the alternatives.

| Page | Desktop board | Phone board |
| --- | --- | --- |
| Home | `Bento-Citation-Soon`, `Bento-Citation-Live` | the same names with `-Phone` |
| Docs home | `Bento-Citation-DocsHome` | `Bento-Citation-DocsHome-Phone` |
| Docs page | `Bento-Citation-DocsPage` | `Bento-Citation-DocsPage-Phone` |
| Docs examples | `Docs-Citation-AddTicketCategory`, `-Commands`, `-Configuration`, `-ReviewAIAction` | the same names with `-Phone` |
| Other pages | `Site-Citation-<Page>-Soon`, `Site-Citation-<Page>-Live` for AI, About, Changelog, Dashboard, HowItWorks, Legal, NotFound, Pilot, Pricing, Privacy, SignUp, Status, Support | the same names with `-Phone` |

**Soon** is the pre-launch state and **Live** is after launch. One site setting will switch between them.

## Local copies

`citation/README.md` (the brand book) and `citation/tokens.json` are copies of the design system's files, taken on 12 November 2026 from version `1793719935-aada`. The artifact is the source of truth: if they differ, re-copy from it and say so in the PR.

`tokens.json` is the design system's own format (lists of `{name, value, usage}`), not CSS. The foundations PR generates the site's CSS custom properties from it.
