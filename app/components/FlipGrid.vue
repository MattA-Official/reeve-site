<script setup lang="ts">
// Citation FlipCard grid (.rv-flipgrid): fixed-footprint layouts, one open card at a time, FLIP motion.
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
const narrow = ref(false)
const grid = useTemplateRef<HTMLElement>('grid')
let reduceMotion = false
let observer: ResizeObserver | undefined

const layout = computed(() => bentoLayouts(props.layouts, props.items, open.value))
const NARROW_BELOW = 860 // breakpoint-narrow; CSS uses it in the container query in site.css

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const page = grid.value?.closest<HTMLElement>('.rv-page') ?? grid.value
  if (!page) return
  observer = new ResizeObserver(([entry]) => {
    if (entry) narrow.value = entry.contentRect.width < NARROW_BELOW
  })
  observer.observe(page)
})
onBeforeUnmount(() => observer?.disconnect())

function cellStyle(index: number) {
  const place = (cell: Cell | undefined) => cell ? [`${cell[0] + 1} / span ${cell[2]}`, `${cell[1] + 1} / span ${cell[3]}`] : ['auto', 'auto']
  const [deskCol, deskRow] = place(layout.value.desk[index])
  const [phoneCol, phoneRow] = place(layout.value.phone[index])
  return { '--bento-desk-col': deskCol, '--bento-desk-row': deskRow, '--bento-phone-col': phoneCol, '--bento-phone-row': phoneRow }
}

function sizeOf(index: number) {
  const cell = (narrow.value ? layout.value.phone : layout.value.desk)[index]
  const [, , w, h] = cell ?? [0, 0, 1, 1]
  return {
    width: w,
    height: h,
    narrow: narrow.value,
    large: !narrow.value && w >= 2 && h >= 2,
    compact: w === 1 && h === 1 && (open.value !== null || narrow.value),
  }
}

// Animate every item from where it was to where it now is (FLIP), then move focus.
async function setOpen(id: string | null, focus: string | null) {
  const items = [...(grid.value?.querySelectorAll<HTMLElement>('[data-card]') ?? [])]
  const first = new Map(items.map(el => [el.dataset.card, el.getBoundingClientRect()]))
  open.value = id
  await nextTick()
  if (!reduceMotion) {
    const timing = getComputedStyle(grid.value!)
    const duration = Number.parseFloat(timing.getPropertyValue('--grow-duration')) || 0
    const easing = timing.getPropertyValue('--ease-settle').trim() || 'ease'
    for (const el of items) {
      const a = first.get(el.dataset.card)
      const b = el.getBoundingClientRect()
      if (!a || !b.width || !b.height) continue
      const dx = a.left - b.left
      const dy = a.top - b.top
      const sx = a.width / b.width
      const sy = a.height / b.height
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) continue
      el.animate([
        { transformOrigin: '0 0', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
        { transformOrigin: '0 0', transform: 'none' },
      ], { duration, easing })
    }
  }
  if (focus) {
    // Wait for the card to turn before moving focus, so the browser doesn't scroll to a half-turned face.
    // Half of flip-duration: by then the new face is the one showing.
    const turn = Number.parseFloat(getComputedStyle(grid.value!).getPropertyValue('--flip-duration')) * 1000 / 2 || 0
    window.setTimeout(() => grid.value?.querySelector<HTMLElement>(focus)?.focus({ preventScroll: !narrow.value }), reduceMotion ? 0 : turn)
  }
}

function toggle(id: string) {
  if (open.value === id) setOpen(null, `[data-front="${id}"]`)
  else setOpen(id, `[data-back="${id}"]`)
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
  >
    <div
      v-for="(id, index) in items"
      :key="id"
      class="rv-bento-cell"
      :class="{
        'rv-flip': !fixed?.includes(id),
        'rv-flip-lg': sizeOf(index).large,
        'rv-flip-compact': sizeOf(index).compact,
      }"
      :data-card="id"
      :data-open="open === id ? '' : undefined"
      :style="cellStyle(index)"
    >
      <slot
        :id="id"
        :index="index"
        :open="open === id"
        :size="sizeOf(index)"
        :toggle="() => toggle(id)"
        :open-card="openCard"
      />
    </div>
  </section>
</template>
