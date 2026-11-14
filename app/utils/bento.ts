// Fixed-footprint bento layouts (Citation FlipCard). A layout is one [column, row, width, height] entry per
// item, in item order, counted from 0. Every desktop layout keeps the same footprint, so the grid never
// changes height when a card opens.
export type Cell = readonly [x: number, y: number, w: number, h: number]
export type Layout = readonly Cell[]

export interface BentoLayouts {
  // The closed desktop layout, then one hand-set layout per card that can open, keyed by card id.
  desk: Record<string, Layout> & { base: Layout }
  // The closed phone layout. Open phone layouts are packed from it with `pack`.
  phone: Layout
  // How big each card grows on phones when open, as [width, height]. Defaults to 2 × 3.
  phoneOpen?: Record<string, readonly [number, number]>
}

const PHONE_COLUMNS = 2

// Places items in order on a two-column grid, growing the open item to `size`, then fills each hole by
// growing the item to its left, above it or to its right. Ported from the design system's FlipCard.
export function pack(base: Layout, openIndex: number, size: readonly [number, number]): Layout {
  const grid: number[][] = []
  const out: { x: number, y: number, w: number, h: number }[] = []
  const row = (y: number) => {
    while (grid.length <= y) grid.push(Array.from({ length: PHONE_COLUMNS }, () => -1))
    return grid[y]!
  }
  const fits = (x: number, y: number, w: number, h: number) => {
    if (x + w > PHONE_COLUMNS) return false
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (row(j)[i] !== -1) return false
    return true
  }
  const put = (k: number, x: number, y: number, w: number, h: number) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) row(j)[i] = k
    out[k] = { x, y, w, h }
  }

  let cursor = 0
  base.forEach((cell, k) => {
    const w = k === openIndex ? size[0] : cell[2]
    const h = k === openIndex ? size[1] : cell[3]
    for (let c = cursor; c < 1000; c++) {
      const x = c % PHONE_COLUMNS
      const y = Math.floor(c / PHONE_COLUMNS)
      if (fits(x, y, w, h)) {
        put(k, x, y, w, h)
        cursor = c
        break
      }
    }
  })

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < PHONE_COLUMNS; x++) {
      if (row(y)[x] !== -1) continue
      const left = x > 0 ? row(y)[x - 1]! : -1
      if (left >= 0) {
        const r = out[left]!
        let ok = r.x + r.w === x
        for (let j = r.y; ok && j < r.y + r.h; j++) if (row(j)[x] !== -1) ok = false
        if (ok) {
          for (let j = r.y; j < r.y + r.h; j++) row(j)[x] = left
          r.w++
          continue
        }
      }
      const up = y > 0 ? row(y - 1)[x]! : -1
      if (up >= 0) {
        const r = out[up]!
        let ok = r.y + r.h === y
        for (let i = r.x; ok && i < r.x + r.w; i++) if (row(y)[i] !== -1) ok = false
        if (ok) {
          for (let i = r.x; i < r.x + r.w; i++) row(y)[i] = up
          r.h++
          continue
        }
      }
      const right = x < PHONE_COLUMNS - 1 ? row(y)[x + 1]! : -1
      if (right >= 0) {
        const r = out[right]!
        let ok = r.x === x + 1
        for (let j = r.y; ok && j < r.y + r.h; j++) if (row(j)[x] !== -1) ok = false
        if (ok) {
          for (let j = r.y; j < r.y + r.h; j++) row(j)[x] = right
          r.x--
          r.w++
        }
      }
    }
  }
  return out.map(r => [r.x, r.y, r.w, r.h] as const)
}

// The layouts for both breakpoints with `openId` open (or none).
export function bentoLayouts(layouts: BentoLayouts, ids: readonly string[], openId: string | null) {
  const k = openId ? ids.indexOf(openId) : -1
  return {
    desk: (openId && layouts.desk[openId]) || layouts.desk.base,
    phone: k < 0 ? layouts.phone : pack(layouts.phone, k, layouts.phoneOpen?.[openId!] ?? [2, 3]),
  }
}

// The cells an item covers, for checking that a layout has no overlaps or holes.
export function covered(layout: Layout): string[] {
  return layout.flatMap(([x, y, w, h]) =>
    Array.from({ length: w * h }, (_, i) => `${x + (i % w)},${y + Math.floor(i / w)}`))
}

// The home page bento, from Bento-Citation-Soon and -Live (the same layouts in both).
// Items: hero, cases, reports, tickets, appeals, ai, rules, privacy, concerns, cta.
export const homeBento: BentoLayouts = {
  desk: {
    base: [[0, 0, 3, 2], [3, 0, 2, 1], [5, 0, 1, 2], [3, 1, 1, 1], [4, 1, 1, 1], [0, 2, 2, 2], [2, 2, 1, 1], [3, 2, 2, 1], [5, 2, 1, 1], [2, 3, 4, 1]],
    cases: [[0, 0, 3, 2], [3, 0, 3, 2], [0, 2, 1, 1], [1, 2, 1, 1], [2, 2, 1, 1], [3, 2, 2, 2], [5, 2, 1, 1], [0, 3, 2, 1], [2, 3, 1, 1], [5, 3, 1, 1]],
    reports: [[0, 0, 3, 2], [3, 0, 1, 1], [4, 0, 2, 3], [3, 1, 1, 1], [0, 2, 1, 1], [1, 2, 2, 2], [3, 2, 1, 1], [0, 3, 1, 1], [3, 3, 1, 1], [4, 3, 2, 1]],
    tickets: [[0, 0, 3, 2], [3, 0, 2, 1], [5, 0, 1, 1], [3, 1, 3, 2], [0, 2, 1, 1], [1, 2, 2, 1], [0, 3, 1, 1], [1, 3, 2, 1], [3, 3, 1, 1], [4, 3, 2, 1]],
    appeals: [[0, 0, 3, 2], [3, 0, 1, 1], [4, 0, 1, 1], [5, 0, 1, 1], [3, 1, 3, 2], [0, 2, 2, 2], [2, 2, 1, 1], [2, 3, 2, 1], [4, 3, 1, 1], [5, 3, 1, 1]],
    ai: [[0, 0, 3, 2], [3, 0, 2, 1], [5, 0, 1, 2], [3, 1, 1, 1], [4, 1, 1, 1], [0, 2, 3, 2], [3, 2, 1, 1], [4, 2, 2, 1], [3, 3, 1, 1], [4, 3, 2, 1]],
    rules: [[0, 0, 3, 2], [3, 0, 2, 1], [5, 0, 1, 2], [3, 1, 1, 1], [4, 1, 1, 1], [0, 2, 1, 2], [1, 2, 3, 2], [4, 2, 2, 1], [4, 3, 1, 1], [5, 3, 1, 1]],
    privacy: [[0, 0, 3, 2], [3, 0, 2, 1], [5, 0, 1, 2], [3, 1, 1, 1], [4, 1, 1, 1], [0, 2, 2, 1], [2, 2, 1, 1], [3, 2, 3, 2], [0, 3, 1, 1], [1, 3, 2, 1]],
    concerns: [[0, 0, 3, 2], [3, 0, 2, 1], [5, 0, 1, 2], [3, 1, 1, 1], [4, 1, 1, 1], [0, 2, 1, 1], [1, 2, 1, 1], [2, 2, 1, 1], [3, 2, 3, 2], [0, 3, 3, 1]],
    cta: [[0, 0, 2, 2], [2, 0, 1, 1], [3, 0, 1, 1], [4, 0, 1, 1], [5, 0, 1, 1], [2, 1, 1, 1], [3, 1, 1, 1], [4, 1, 1, 1], [5, 1, 1, 1], [0, 2, 6, 2]],
  },
  phone: [[0, 0, 2, 2], [0, 2, 2, 1], [0, 3, 1, 2], [1, 3, 1, 1], [1, 4, 1, 1], [0, 5, 2, 2], [0, 7, 1, 1], [1, 7, 1, 2], [0, 8, 1, 1], [0, 9, 2, 1]],
  phoneOpen: { cta: [2, 5] },
}

// How it works, "From report to review": Site-Citation-HowItWorks-Soon and its -Phone board.
export const howItWorksBento: BentoLayouts = {
  desk: {
    base: [[0, 0, 2, 1], [2, 0, 2, 2], [4, 0, 2, 1], [0, 1, 1, 1], [1, 1, 1, 1], [4, 1, 2, 1]],
    report: [[0, 0, 3, 2], [3, 0, 2, 1], [5, 0, 1, 1], [3, 1, 1, 1], [4, 1, 1, 1], [5, 1, 1, 1]],
    case: [[0, 0, 1, 1], [1, 0, 3, 2], [4, 0, 2, 1], [0, 1, 1, 1], [4, 1, 1, 1], [5, 1, 1, 1]],
    notice: [[0, 0, 2, 1], [2, 0, 1, 1], [3, 0, 3, 2], [0, 1, 1, 1], [1, 1, 1, 1], [2, 1, 1, 1]],
    appeal: [[0, 0, 1, 1], [1, 0, 1, 1], [2, 0, 1, 1], [3, 0, 3, 2], [0, 1, 1, 1], [1, 1, 2, 1]],
    concern: [[0, 0, 1, 1], [1, 0, 1, 1], [2, 0, 1, 1], [3, 0, 1, 1], [4, 0, 2, 2], [0, 1, 4, 1]],
    digest: [[0, 0, 1, 1], [1, 0, 1, 1], [2, 0, 1, 1], [3, 0, 1, 1], [0, 1, 4, 1], [4, 0, 2, 2]],
  },
  phone: [[0, 0, 2, 1], [0, 1, 1, 2], [1, 1, 1, 1], [1, 2, 1, 1], [0, 3, 1, 1], [1, 3, 1, 1]],
}
