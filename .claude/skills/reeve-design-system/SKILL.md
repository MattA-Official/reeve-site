---
name: reeve-design-system
description: The Citation design system for the Reeve website — tokens, card tones, the six-column bento, fixed-footprint flip cards, type, states and the bracket mark — and how to port a component from the design system into Vue. Use before writing any component, style or page markup.
---

# Reeve design system (Citation)

The brand book is `design/citation/README.md`; the tokens are `design/citation/tokens.json`. Read the brand book's Visual foundations before styling anything. This skill is the working summary and the porting method.

## Tokens

`tokens.json` holds lists of `{name, value, usage}`. Every value the site uses comes from it, as a CSS custom property of the same name (`--bg`, `--space-14`, `--radius-card`, `--ease-settle`). The `usage` note on each token says where it may go and its contrast ratio on each ground: read it before using a token on a new ground.

| Family | Count | Names worth knowing |
| --- | --- | --- |
| color | 87 | `bg`, `surface`, `code-bg`, `rule`, `ink`, `body`, `muted`, `accent`, `on-accent`, `link`, `focus`, `focus-on-light`; per tone `<tone>-bg/-fg/-border/-sub/-tag/-dot/-chip/-on-chip`; card backs `back-*`; `status-working`, `status-paused`; `discord-*` for mock-ups only |
| type | 4 groups | Display `h1`, `h2`, `doc-h1`, `doc-h2` (each with a `-narrow`); Titles `title-2xl` … `title-s`, `flip-title`; Text `lead`, `intro`, `prose`, `body`, `body-s`, `note`, `fine`, `label`, `button`, `question`; Mono `wordmark`, `price`, `kicker`, `tag`, `ref`, `code` |
| spacing | 16 | `space-2` … `space-64` |
| radius | 6 | `radius-bar` 2, `radius-code` 4, `radius-chip` 5, `radius-control` 6, `radius-card` 8, `radius-round` |
| shadow | 1 | `shadow-menu`, floating menus only |
| size | 15 | `target-min` 44, `content-max` 1440, `docs-max`, `doc-measure`, `prose-measure`, `docs-sidebar`, `docs-toc`, `bento-row`, `dot-pitch`, `breakpoint-narrow` 860, `breakpoint-nav` 1120 |
| timing | 3 | `grow-duration`, `flip-duration`, `ease-settle` |

Fonts: Atkinson Hyperlegible (400, 700) for reading; Spline Sans Mono (400, 500) for references, labels, figures, code and the wordmark. `@nuxt/fonts` self-hosts both.

## Layout

- Pages sit in `.rv-page`, at most `content-max` wide, `space-40` gutters (`space-16` narrow). The narrow layout keys off the page's width.
- Section: `space-64` top padding (`space-40` narrow), an `h2` with its `[n]` in `accent` at 0.55em, an optional `intro` at `prose-measure`, content `space-18` below.
- Bento: six columns, `space-14` gap (`space-12` narrow), cards span 1–6 columns, padding `space-22` × `space-24` (`space-18` narrow). Narrow: 6- and 4-column grids become 2; 2- and 3-column grids become 1.
- Fixed footprint: when a flip card opens, the grid keeps its overall size; the open card grows (say 2×1 → 3×2) and the others move to positions hand-set for that card. One layout per open card, in reading order where possible. On phones, two columns in order, holes filled by growing a neighbour.

## Card tones

Five tones, chosen for rhythm, never for meaning: `card` (default), `special` (dot grid, one per view), `tint` (second in a row), `accent` (what the section is for, at most one or two per view), `ink` (light, inverts the page: limits, plan banners, next-page link). Apply with `rv-tone-<tone>`. On light fills (ink and accent tones, card backs, the CTA band) text is dark (`ink-fg`, `ink-sub`, `ink-tag`, `back-link`) and buttons are `rv-btn-dark`.

## States

- Focus: 3px solid outline, 2px offset, `focus` on dark, `focus-on-light` on light.
- Selected: `accent` fill with `on-accent` text, or a 2px `accent` bar; always with `aria-pressed` or `aria-current`.
- Expand and collapse: mono `+` and `−` in `accent`, `aria-expanded` on the control.
- Results: a `role="status"` line led by a bracketed tag (`[done]`, `[paid]`).

## The mark

Two square brackets around a dot. Files are in the design system's `assets/Logos`: accent on dark grounds, ink where accent is busy, dark on light fills. The wordmark is live text: lowercase `reeve`, Spline Sans Mono 500, -0.03em, `space-10` from the mark (32px mark + 26px wordmark in the header; 28 + 22 in footer and docs). No emoji, illustrations or photos; product pictures are Discord mock-ups.

## Porting a component

1. Read the component's guidelines and preview from the design system: Artifact `read` on https://claude.ai/artifact/2SYz8HQaYonykMZ3CwqxNR with `paths: ["project/components/<Name>/README.md", "project/components/<Name>/preview.html"]`, and the `rv-<name>` rules in `project/components/bundle.css`.
2. Make `app/components/<Name>.vue` with the same `rv-` classes and structure. Move the CSS into the component's `<style>` (or `app/assets/css/` if shared), keeping token references.
3. Replace the preview's script with Vue state that writes the same ARIA attributes the CSS reads.
4. Props carry content; strings come from i18n or content, never literals.
5. Add a component test in `tests/nuxt/` that queries by role and checks the ARIA state changes.

Components in the design system: BetaForm, Button, Callout, Card, Chip, CodeBlock, ConfigEditor, Confirmation, Contents, CtaBand, Disclosure, DiscordPanel, DocsHeader, DocsNav, Field, FlipCard, Heading, List, Logo, Meter, OptionButton, Pager, Segmented, ServerSwitcher, SiteFooter, SiteHeader, StatusRow, Steps, Table.

## Known contrast gaps

The brand book keeps three pairs that fall short: `border-control` on `bg` (1.74:1), `back-input-border` on `back-bg` (1.59:1), and card-back field placeholders (3.24:1). Their token notes suggest replacement values. Use the replacements on the site, and mention it in the PR.
