<!-- Boards: Site-Citation-NotFound-Soon, Site-Citation-NotFound-Live (and their -Phone boards) -->
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()
const { isBuilt } = useSiteLinks()

// The error page doesn't render inside app.vue, so it sets the language itself.
const head = useLocaleHead()
useHead(() => ({ htmlAttrs: { lang: head.value.htmlAttrs.lang } }))

const notFound = computed(() => props.error.statusCode === 404)
const copy = computed(() => (notFound.value ? 'notFound' : 'failed'))

useSeoMeta({
  title: () => t(`error.${copy.value}.title`),
  robots: 'noindex',
})

// Cards point only at pages that exist; the home card is always there.
const cards = computed(() => [
  { id: 'home', tone: 'accent', to: '/' },
  { id: 'docs', tone: 'card', to: '/docs' },
  { id: 'help', tone: 'ink', to: '/support' },
].filter(card => card.id === 'home' || isBuilt(card.to)))
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <main class="rv-main">
      <div class="rv-grid">
        <div class="rv-hero rv-span-4">
          <span class="rv-kicker">{{ error.statusCode || 500 }}</span>
          <h1 class="rv-h1">
            {{ t(`error.${copy}.title`) }}
          </h1>
          <p class="rv-lead">
            {{ t(`error.${copy}.lead`) }}
          </p>
        </div>
      </div>
      <div class="rv-grid rv-error-cards">
        <div
          v-for="card in cards"
          :key="card.id"
          :class="['rv-card', 'rv-span-2', `rv-tone-${card.tone}`]"
        >
          <span class="rv-tag">{{ t(`error.cards.${card.id}.tag`) }}</span>
          <h2 class="rv-title">
            {{ t(`error.cards.${card.id}.title`) }}
          </h2>
          <p class="rv-text rv-text-s">
            {{ t(`error.cards.${card.id}.text`) }}
          </p>
          <NuxtLink
            class="rv-error-link"
            :to="localePath(card.to)"
          >
            {{ t(`error.cards.${card.id}.link`) }}
          </NuxtLink>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>
