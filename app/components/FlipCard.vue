<script setup lang="ts">
// Citation FlipCard: a front button that turns over to a back region. The grid places and sizes it.
export interface Chip {
  text: string
  kind?: 'plain' | 'ref' | 'ui' | 'status' | 'cta'
}

const props = defineProps<{
  id: string
  index: number
  tone: 'card' | 'special' | 'tint' | 'accent' | 'ink'
  title: string
  desc: string
  chips: Chip[]
  open: boolean
  backLabel: string
  closeLabel: string
  // The back's own header can be left out (the beta form draws its own).
  plainBack?: boolean
  kicker?: string
}>()

const emit = defineEmits<{ toggle: [] }>()
const backId = computed(() => `bento-back-${props.id}`)
// At most three chips; site.css shows only the first on small cards.
const shown = computed(() => props.chips.slice(0, 3))
const chipClass = (chip: Chip) => (chip.kind && chip.kind !== 'plain' ? `rv-chip rv-chip-${chip.kind}` : 'rv-chip')

function onKeydown(event: KeyboardEvent) {
  // Escape in a select closes its list, not the card.
  if (event.target instanceof HTMLSelectElement) return
  if (event.key === 'Escape' && props.open) {
    // Marks the key as handled, so the grid doesn't close the card a second time.
    event.preventDefault()
    emit('toggle')
  }
}
</script>

<template>
  <div class="rv-flip-inner">
    <button
      type="button"
      class="rv-flip-front"
      :class="`rv-tone-${tone}`"
      :data-front="id"
      :aria-expanded="open"
      :aria-controls="backId"
      :aria-hidden="open"
      :inert="open"
      @click="emit('toggle')"
    >
      <span class="rv-flip-top">
        <span class="rv-flip-head">
          <span
            class="rv-tag"
            aria-hidden="true"
          >{{ index }}</span>
          <span
            class="rv-flip-plus"
            aria-hidden="true"
          >+</span>
        </span>
        <span class="rv-flip-title">{{ title }}</span>
        <span class="rv-flip-desc">{{ desc }}</span>
      </span>
      <span class="rv-chips">
        <span
          v-for="chip in shown"
          :key="chip.text"
          :class="chipClass(chip)"
        >{{ chip.text }}<span
          v-if="chip.kind === 'cta'"
          aria-hidden="true"
        >&nbsp;&rarr;</span></span>
      </span>
    </button>
    <div
      :id="backId"
      class="rv-flip-back"
      role="region"
      :aria-label="backLabel"
      :aria-hidden="!open"
      :inert="!open"
      @keydown="onKeydown"
    >
      <div
        v-if="!plainBack"
        class="rv-flip-backhead"
      >
        <span>
          <span class="rv-flip-kicker">[{{ index }}] {{ kicker }}</span>
          <span class="rv-flip-backtitle">{{ title }}</span>
        </span>
        <button
          type="button"
          class="rv-flip-close"
          :data-back="id"
          :aria-label="closeLabel"
          @click="emit('toggle')"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <button
        v-else
        type="button"
        class="rv-flip-close rv-flip-close-corner"
        :data-back="id"
        :aria-label="closeLabel"
        @click="emit('toggle')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <slot />
    </div>
  </div>
</template>
