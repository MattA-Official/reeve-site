---
paths:
  - "content/**"
  - "i18n/locales/**"
---

# Copy and content

- British English: organisation, colour, licence. Dates read 14 March 2026; times use the 24-hour clock.
- Sentence case for titles, nav, buttons and labels. Mono labels are lowercase and bracketed: `[on this page]`.
- Plain and calm: short sentences, no exclamation marks, superlatives, urgency or emoji. Say what happens and what doesn't.
- "We" is the company, "you" is the owner or moderator reading, "members" are the community. Name the person who acts.
- Buttons are a verb and an object. Never "Submit", "OK" or "Click here".
- Prices: "£24 a month", "£240 a year", always with "Prices exclude VAT, which is added at checkout where it applies." Before launch, an undecided price reads "Planned".
- AI: say what the model sees and the three things it may do alone (delete a message, hold back an attachment, time out for up to an hour), and that a person can undo each.
- Rules: public numbers only (`Rule 3`), never `3.2.a`, never internal rule text.
- Design placeholders (`[date]`, `[n]`, `£[price]`, `[COMPANY NAME]`) must not ship. A unit test checks the locale files.
- Content files live under `content/<locale>/` and every page has `title` and `description` frontmatter. Add a locale by adding a collection in `content.config.ts` and a file in `i18n/locales/`.
