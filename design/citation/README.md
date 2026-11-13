Reeve is moderation for a single Discord community: cases, reports, tickets and appeals, with AI that may only take small actions a person can undo. The look is called Citation. It uses a dark ink ground and one lavender accent, and it brackets every reference the way a citation would: [1], [stage 2], [private beta].

## Content fundamentals

**Voice.** Plain and calm. Say what happens, and also what doesn't: "Nothing changes yet." "Everything keeps working as it is." Use short sentences, with no exclamation marks, superlatives or urgency, and no emoji anywhere.

**British English.** Write organisation, colour, licence and "a month", not "per month". Dates read 14 March 2026. Times use the 24-hour clock: 14:02.

**Sentence case** for titles, nav, buttons and labels. Mono labels are all lowercase: `[on this page]`, `[servers reeve is in]`. The product is Reeve in prose and `reeve` only in the wordmark.

**People.** "We" means the company and "you" means the owner or moderator reading. "Members" are the community. Name the person who acts: "Upheld by @alex", not "Upheld".

**Buttons are a verb and an object.** Examples: "Join the beta", "Add to Discord", "Start free trial", "Buy with card ending 1234", "Save and reload", "Add another server", "Compare plans in full". Never use "Submit", "OK" or "Click here".

**Status in words.** A colour, a bar or a border never carries meaning on its own. Write `[working]`, "Paused once in the last 60 days" or "Reversed by @alex. The timeout is lifted, and the case records why."

**Cite with brackets.** Section numbers, list markers, card tags, kickers and badges are mono and bracketed. The brackets take `accent`. The word inside takes the surrounding label colour: `muted` for kickers and footer headings, and the tone's `-tag` colour inside cards.

**Rules.** Copy a member will read cites public rule numbers only, such as "Rule 3" or a `[3]` chip. Never cite `3.2.a`, and never include internal rule text.

**Be exact about AI.** Say what the model sees ("names, user IDs, mentions and profile links are replaced first"). Say the three things it may do alone: delete a message, hold back an attachment, or time a member out for up to an hour. Say that a person can undo any of them.

**Money.** Prices are written "£24 a month" and "£240 a year". Always add "Prices exclude VAT, which is added at checkout where it applies." Before launch, a price that is not decided reads "Planned" and is never given as a figure.

**Placeholders.** Design copy marks unknowns in square brackets: [date], [n], £[price], [COMPANY NAME]. These are for the design stage only and must not ship.

## Visual foundations

### Colour

- Set every page on `bg`. Headings use `ink`, paragraphs `body`, and metadata only `muted`. `surface` is for the docs header and the strips around docs articles. `code-bg` is only for code.
- `accent` is the only hue. Spend it on brackets, `[n]` tags, the current-page underline, one primary button per view, the meter fill, and at most one or two accent-tone cards per view. Text on an accent fill is `on-accent`. Links on dark grounds are `link`.
- Cards come in five tones. Choose them to give a grid rhythm, not to signal meaning:
  - **card**: the default.
  - **special**: the ground with a `rule` dot grid at `dot-pitch`, for one card that should stand apart.
  - **tint**: for the second thing in a row.
  - **accent**: for the thing the section is for.
  - **ink**: a light card that inverts the page, for lists of limits, plan-limit banners and the next-page link.
- Every tone has a `-bg`, `-fg`, `-border`, `-sub`, `-tag`, `-dot`, `-chip` and `-on-chip` token. Apply them all at once with `rv-tone-<tone>`.
- Light fills are the ink and accent tones, card backs and the CTA band. On these, text is dark: `ink-fg`, `ink-sub`, `ink-tag` and `back-link`, and buttons are `rv-btn-dark`. Never put `muted`, `link` or `focus` on a light fill.
- Discord mock-ups use the `discord-*` tokens and nothing else. Never use those tokens on Reeve's own pages.
- Every text token's note names the grounds it is legible on, with its ratio. Three pairs from the site fall short, and are kept as the site has them:
  - `border-control` is 1.74:1 on `bg`.
  - `back-input-border` is 1.59:1 on `back-bg`.
  - Placeholders on card-back fields are 3.24:1.

  The notes on those tokens suggest replacement values.

### Type

- Atkinson Hyperlegible for everything people read: 400 for text, and 700 for headings, labels, buttons and questions. Spline Sans Mono for anything that is a reference, a label, a figure or code, and for the wordmark. Both load from Google Fonts. There is no third family; Discord mock-ups fall back to Noto Sans.
- Use the type styles. Wide sizes step down below 860px:
  - Headings: `h1` 64 (narrow 40), `h2` 36 (27) with its `[n]` prefix at 0.55em in `accent`, and `doc-h1` 48 (36).
  - Card titles run from `title-2xl` (30) to `title-s` (20). Choose by the card's span.
  - Text: `lead` 21 (18), `intro` 18, `prose` 17, `body` 16, `body-s` 15, `note` 14 and `fine` 13. Nothing goes below 13.
- Headings tighten (-0.025em to -0.01em). Mono labels open up (0.02em). Prices and the wordmark tighten (-0.03em).

### Space and layout

- Content is at most `content-max` (1440px) wide, with `space-40` gutters. Below `breakpoint-narrow` (860px) the gutters shrink to `space-16`.
- Every section has the same shape:
  1. `space-64` of top padding (`space-40` narrow).
  2. An `h2` with `[n]`.
  3. An optional `intro` at `prose-measure`.
  4. The content, `space-18` below the heading.
- **The bento.** A six-column grid with a `space-14` gap (`space-12` narrow). Cards span one to six columns. Below 860px, six- and four-column grids become two columns, and two- and three-column grids become one. Card padding is `space-22` by `space-24` (`space-18` narrow).
- **The fixed footprint.** A flip grid keeps its overall size when a card opens. The open card grows, for example from 2×1 to 3×2, and the others move into places hand-set for that card. Design one layout per open card, and keep cards in reading order where possible. On phones, cards pack into two columns in order, and any holes are filled by growing a neighbour.
- The header nav folds into a Menu button below `breakpoint-nav` (1120px).
- The docs layout is `docs-sidebar` + `doc-measure` + `docs-toc`, inside `docs-max`.
- Hit areas are at least `target-min` (44px) for actions and main navigation. Dense lists (footer, table of contents, copy buttons) go down to 36px.

### Borders, radii and shadows

- Use borders, not shadows. Every card has a 1px edge in its tone's border colour, and hairlines are `rule`. The one shadow, `shadow-menu`, is for things that float, such as the server menu.
- Radii are small: `radius-card` 8, `radius-control` 6, `radius-chip` 5, `radius-code` 4 and `radius-bar` 2. Only a flip card's + and × controls are round (`radius-round`).
- No gradients except the special tone's dot grid. No coloured side borders on cards.

### Motion

- Only the bento moves. Cards slide to their new places over `grow-duration` and turn over over `flip-duration`, both on `ease-settle`. With reduced motion, they jump straight to the end state.
- Focus moves with the card: to the back's close button on opening, and back to the front on closing. Escape closes it.

### States

- **Focus:** a 3px solid outline with a 2px offset on everything interactive. It uses `focus` on dark grounds and `focus-on-light` on light fills.
- **Selected:** either an `accent` fill with `on-accent` text (segmented options, plan options), or a 2px `accent` bar (nav underline, docs sidebar, server list). Always set `aria-pressed` or `aria-current` too.
- **Expand and collapse:** + and − in mono `accent`, with `aria-expanded` on the control.
- **Results:** a result appears in place as a `role="status"` line led by a bracketed tag, such as `[done]` or `[paid]`.

## Iconography

- Reeve has no icon set. The bracket mark stands for the brand. Controls use mono glyphs: + and − to expand, × to close, → and ← for next and previous, ▾ and ▴ for menus. Glyphs are `aria-hidden`, and the label carries the meaning.
- **The mark** is two square brackets around a dot, on a 48-unit grid with 4-unit strokes. Use the files in `assets/Logos`:
  - `reeve-mark-accent.svg` on dark grounds.
  - `reeve-mark-ink.svg` where accent is already busy.
  - `reeve-mark-dark.svg` on light fills and inside the Discord avatar.
- **The wordmark** is live text: lowercase `reeve` in Spline Sans Mono 500 at -0.03em, `space-10` from the mark. Pair a 32px mark with a 26px wordmark in the header, and a 28px mark with a 22px wordmark in the footer and docs. No outlined wordmark file exists yet.
- Reeve uses no emoji, illustrations or photos. Product pictures are Discord mock-ups built with the DiscordPanel component.

## Using the components

- Load `tokens.css`, then `components/bundle.css`, which imports both fonts. Wrap each page in `.rv-page`: its width, not the viewport's, switches the narrow layout.
- Every class starts with `rv-`. To give a card a tone, add `rv-tone-<tone>`. Mark any other light fill with `rv-light`.
- State lives in ARIA attributes (`aria-pressed`, `aria-expanded`, `aria-current`, `hidden`), and the CSS styles those attributes. Each component's preview includes the few lines of script it needs.
