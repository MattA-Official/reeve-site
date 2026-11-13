<script setup lang="ts">
// Citation Logo: the bracket mark and the lowercase wordmark, linking home.
const props = withDefaults(defineProps<{ small?: boolean }>(), { small: false })
const { t } = useI18n()
const localePath = useLocalePath()
// A deliberate exception to "no raw sizes": the design system's Logo gives the mark as SVG width and height
// attributes (32 in the header, 28 in the footer and docs header), and there is no token for them.
const markSize = computed(() => (props.small ? 28 : 32))
</script>

<template>
  <NuxtLink
    class="rv-brand"
    :to="localePath('/')"
  >
    <svg
      class="rv-mark"
      viewBox="0 0 48 48"
      :width="markSize"
      :height="markSize"
      aria-hidden="true"
    >
      <path
        d="M18 9 H11 V39 H18 M30 9 H37 V39 H30"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
      />
      <circle
        cx="24"
        cy="24"
        r="3.5"
        fill="currentColor"
      />
    </svg>
    <span
      class="rv-wordmark"
      :class="{ 'rv-wordmark-s': small }"
      aria-hidden="true"
    >{{ t('logo.wordmark') }}</span>
    <!-- The link's name comes from this and any badge in the slot, so "private beta" is read out too. -->
    <span class="rv-sr">{{ t('logo.label') }}</span>
    <slot />
  </NuxtLink>
</template>
