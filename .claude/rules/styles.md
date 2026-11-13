---
paths:
  - "app/assets/**/*.css"
  - "app/components/**"
  - "app/layouts/**"
  - "app/pages/**"
---

# Styles

- Values come from the Citation tokens as CSS custom properties. No raw hex, rgb, px sizes or font names outside the token file.
- Plain CSS, scoped in components or in `app/assets/css/`. No Tailwind, UI kit or CSS-in-JS.
- Narrow layout below 860px (`breakpoint-narrow`), keyed to the `.rv-page` container's width, not the viewport. The header nav folds into a Menu button below 1120px (`breakpoint-nav`).
- Bento: six columns, `space-14` gap (`space-12` narrow). Below 860px, six- and four-column grids become two columns; two- and three-column grids become one.
- Borders, not shadows. The only shadow is `shadow-menu` on floating menus. No gradients except the special tone's dot grid. No coloured side borders on cards.
- Focus: 3px solid outline, 2px offset, `focus` on dark grounds and `focus-on-light` on light fills.
- Motion only in the bento, on `ease-settle`. Under `prefers-reduced-motion: reduce`, jump straight to the end state.
- Never put `muted`, `link` or `focus` on a light fill. Never use `discord-*` tokens outside Discord mock-ups.
