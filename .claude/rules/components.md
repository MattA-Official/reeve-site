---
paths:
  - "app/components/**"
  - "app/layouts/**"
---

# Components

- `<script setup lang="ts">` only. Type props with `defineProps<{ … }>()` and emits with `defineEmits<{ … }>()`. No Options API.
- One component per Citation component or board region. Name it after the design system's component (`SiteHeader`, `FlipCard`, `DocsNav`) so a reviewer can find its source.
- Class names start with `rv-` and match the design system's `bundle.css`. A card's tone is `rv-tone-<tone>`; any other light fill is `rv-light`.
- State lives in ARIA attributes (`aria-pressed`, `aria-expanded`, `aria-current`, `hidden`) and the CSS styles those. No `is-active` classes that duplicate state.
- Real elements: `<button>` for actions, `<a>`/`<NuxtLink>` for navigation, `<input>` with a `<label>`. Never a click handler on a `div` or `span`.
- Glyph controls (+, −, ×, →, ▾) are `aria-hidden`; the accessible name comes from the label.
- No copy literals: take strings from `useI18n()` or from props fed by content.
- Flip cards: focus moves to the back's close button on opening and back to the front on closing; Escape closes.
