<script setup lang="ts">
// Citation FlipCard grid (.rv-flipgrid): fixed-footprint layouts, one open card at a time, FLIP motion.
// Each item's place and size at both widths are written as custom properties and data attributes, and
// site.css chooses between them with the rv-page container query, so the layout is right without script.
import type { BentoLayouts, Cell } from '~/utils/bento'

const props = defineProps<{
  // Item ids in reading order. Items that are not flip cards (the hero) are laid out the same way.
  items: readonly string[]
  layouts: BentoLayouts
  label: string
  // Items that are not flip cards, such as the hero.
  fixed?: readonly string[]
}>()

const open = ref<string | null>(null)
const grid = useTemplateRef<HTMLElement>('grid')
const layout = computed(() => bentoLayouts(props.layouts, props.items, open.value))

// "480ms" or "0.6s" as milliseconds.
function toMs(value: string) {
  const n = Number.parseFloat(value)
  if (Number.isNaN(n)) return 0
  return value.trim().endsWith('ms') ? n : n * 1000
}

function place(cell: Cell | undefined) {
  return cell ? [`${cell[0] + 1} / span ${cell[2]}`, `${cell[1] + 1} / span ${cell[3]}`] : ['auto', 'auto']
}

function cellAttrs(index: number) {
  const desk = layout.value.desk[index] ?? [0, 0, 1, 1]
  const phone = layout.value.phone[index] ?? [0, 0, 1, 1]
  const [deskCol, deskRow] = place(desk)
  const [phoneCol, phoneRow] = place(phone)
  return {
    'style': { '--bento-desk-col': deskCol, '--bento-desk-row': deskRow, '--bento-phone-col': phoneCol, '--bento-phone-row': phoneRow },
    // Sizes the CSS reads: "large" is 2 × 2 or more, "small" is 1 × 1, "row" is one row tall.
    'data-desk-size': desk[2] >= 2 && desk[3] >= 2 ? 'large' : desk[2] === 1 && desk[3] === 1 ? 'small' : 'medium',
    'data-desk-wide': desk[2] >= 3 && desk[3] >= 2 ? '' : undefined,
    'data-phone-size': phone[2] === 1 && phone[3] === 1 ? 'small' : phone[3] === 1 ? 'row' : 'medium',
  }
}

// Animate every item from where it was to where it now is (FLIP), then move focus.
async function setOpen(id: string | null, focus: string | null) {
  const el = grid.value
  if (!el) return
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const items = [...el.querySelectorAll<HTMLElement>('[data-card]')]
  const first = new Map(items.map(item => [item.dataset.card, item.getBoundingClientRect()]))
  open.value = id
  await nextTick()
  const tokens = getComputedStyle(el)
  if (!reduceMotion) {
    const duration = toMs(tokens.getPropertyValue('--grow-duration'))
    const easing = tokens.getPropertyValue('--ease-settle').trim() || 'ease'
    for (const item of items) {
      const a = first.get(item.dataset.card)
      const b = item.getBoundingClientRect()
      if (!a || !b.width || !b.height) continue
      const dx = a.left - b.left
      const dy = a.top - b.top
      const sx = a.width / b.width
      const sy = a.height / b.height
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) continue
      item.animate([
        { transformOrigin: '0 0', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
        { transformOrigin: '0 0', transform: 'none' },
      ], { duration, easing })
    }
  }
  if (focus) {
    // Move focus half-way through the turn, when the new face is the one showing. On wide layouts the card
    // is already in view, so don't scroll; on narrow ones let the browser bring it into view.
    const turn = reduceMotion ? 0 : toMs(tokens.getPropertyValue('--flip-duration')) / 2
    const narrowBelow = Number.parseFloat(tokens.getPropertyValue('--breakpoint-narrow'))
    const pageWidth = (el.closest<HTMLElement>('.rv-page') ?? el).getBoundingClientRect().width
    window.setTimeout(() => el.querySelector<HTMLElement>(focus)?.focus({ preventScroll: pageWidth >= narrowBelow }), turn)
  }
}

function toggle(id: string) {
  if (open.value === id) setOpen(null, `[data-front="${id}"]`)
  else setOpen(id, `[data-back="${id}"]`)
}

// Escape closes the open card wherever focus is in the grid, not only on its back. Focus returns to the front
// only if it was inside the card; otherwise it stays where the person put it.
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !open.value || event.defaultPrevented) return
  if (event.target instanceof HTMLSelectElement) return
  const id = open.value
  const inside = grid.value?.querySelector(`[data-card="${id}"]`)?.contains(document.activeElement) ?? false
  setOpen(null, inside ? `[data-front="${id}"]` : null)
}

// Opens a card from outside it (the hero's action); if it is already open, just moves focus to it.
function openCard(id: string) {
  if (open.value === id) grid.value?.querySelector<HTMLElement>(`[data-back="${id}"]`)?.focus()
  else setOpen(id, `[data-back="${id}"]`)
}
</script>

<template>
  <section
    ref="grid"
    class="rv-flipgrid"
    :aria-label="label"
    :data-any-open="open ? '' : undefined"
    @keydown="onKeydown"
  >
    <div
      v-for="(id, index) in items"
      :key="id"
      class="rv-bento-cell"
      :class="{ 'rv-flip': !fixed?.includes(id) }"
      :data-card="id"
      :data-open="open === id ? '' : undefined"
      v-bind="cellAttrs(index)"
    >
      <slot
        :id="id"
        :index="index"
        :open="open === id"
        :toggle="() => toggle(id)"
        :open-card="openCard"
      />
    </div>
  </section>
</template>
