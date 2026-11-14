import { describe, expect, it } from 'vitest'
import type { pack } from '../../app/utils/bento'
import { bentoLayouts, covered, homeBento, howItWorksBento } from '../../app/utils/bento'

const ids = ['hero', 'cases', 'reports', 'tickets', 'appeals', 'ai', 'rules', 'privacy', 'concerns', 'cta']

function footprint(layout: ReturnType<typeof pack>) {
  const cells = covered(layout)
  return { cells: cells.length, unique: new Set(cells).size, rows: Math.max(...layout.map(([, y, , h]) => y + h)) }
}

describe('home bento layouts', () => {
  it('every desktop layout fills the same six-by-four footprint with no overlaps', () => {
    for (const [name, layout] of Object.entries(homeBento.desk)) {
      expect(layout, name).toHaveLength(ids.length)
      expect(footprint(layout), name).toEqual({ cells: 24, unique: 24, rows: 4 })
      for (const [x, , w] of layout) expect(x + w, name).toBeLessThanOrEqual(6)
    }
  })

  it('has an open layout for every card except the hero', () => {
    expect(Object.keys(homeBento.desk).sort()).toEqual(['base', ...ids.slice(1)].sort())
  })

  it('the phone layouts have no overlaps or holes, closed or with any card open', () => {
    for (const id of [null, ...ids.slice(1)]) {
      const { phone } = bentoLayouts(homeBento, ids, id)
      const { cells, unique, rows } = footprint(phone)
      expect(unique, String(id)).toBe(cells)
      expect(cells, String(id)).toBe(rows * 2)
    }
  })

  it('grows the open card on phones to its open size', () => {
    const { phone } = bentoLayouts(homeBento, ids, 'cta')
    expect(phone[9]).toEqual([0, 9, 2, 5])
    expect(bentoLayouts(homeBento, ids, 'cases').phone[1]).toEqual([0, 2, 2, 3])
  })
})

describe('how it works bento layouts', () => {
  const steps = ['report', 'case', 'notice', 'appeal', 'concern', 'digest']

  it('every desktop layout fills the same six-by-two footprint with no overlaps', () => {
    for (const [name, layout] of Object.entries(howItWorksBento.desk)) {
      expect(layout, name).toHaveLength(steps.length)
      expect(footprint(layout), name).toEqual({ cells: 12, unique: 12, rows: 2 })
      for (const [x, , w] of layout) expect(x + w, name).toBeLessThanOrEqual(6)
    }
    expect(Object.keys(howItWorksBento.desk).sort()).toEqual(['base', ...steps].sort())
  })

  it('the phone layouts have no overlaps or holes, closed or with any card open', () => {
    for (const id of [null, ...steps]) {
      const { phone } = bentoLayouts(howItWorksBento, steps, id)
      const { cells, unique, rows } = footprint(phone)
      expect(unique, String(id)).toBe(cells)
      expect(cells, String(id)).toBe(rows * 2)
    }
  })
})
