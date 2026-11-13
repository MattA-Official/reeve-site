<script setup lang="ts">
// Home. Boards: Bento-Citation-Soon, Bento-Citation-Live, and their -Phone versions.
import type { Chip } from '~/components/FlipCard.vue'

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const { reeve } = useAppConfig()
const { isBuilt } = useSiteLinks()

const state = computed(() => (reeve.launched ? 'live' : 'soon'))

useHead({ titleTemplate: '%s' })
useSeoMeta({
  title: () => t('home.title'),
  description: () => t('home.description'),
})

// Card order, tones and chip kinds come from the boards; the words come from the locale file.
const cards = [
  { id: 'cases', tone: 'special', chips: ['ref', 'plain'] },
  { id: 'reports', tone: 'ink', chips: ['status'] },
  { id: 'tickets', tone: 'card', chips: ['ref', 'plain'] },
  { id: 'appeals', tone: 'tint', chips: ['ui'] },
  { id: 'ai', tone: 'accent', chips: ['plain', 'plain', 'plain'] },
  { id: 'rules', tone: 'card', chips: ['ref'] },
  { id: 'privacy', tone: 'special', chips: ['plain'] },
  { id: 'concerns', tone: 'card', chips: ['ui'] },
] as const
const items = ['hero', ...cards.map(card => card.id), 'cta']

const strings = (key: string) => (tm(key) as unknown as string[]).map(s => rt(s))
const chipsFor = (card: (typeof cards)[number]): Chip[] =>
  strings(`home.cards.${card.id}.chips`).map((text, i) => ({ text, kind: card.chips[i] ?? 'plain' }))
const cardById = (id: string) => cards.find(card => card.id === id)!

const cta = computed(() => `home.cards.cta.${state.value}`)
const steps = computed(() => (tm('home.cards.cta.live.steps') as unknown as { title: string, text: string }[])
  .map(step => ({ title: rt(step.title), text: rt(step.text) })))
// Doc links appear once the docs pages exist.
const docsBuilt = computed(() => isBuilt('/docs'))
</script>

<template>
  <main class="rv-main">
    <FlipGrid
      :items="items"
      :layouts="homeBento"
      :fixed="['hero']"
      :label="t('home.bento.label')"
    >
      <template #default="{ id, index, open, size, toggle, openCard }">
        <div
          v-if="id === 'hero'"
          class="rv-bento-hero"
          :data-big="!size.narrow && size.width >= 3 && size.height >= 2 ? '' : undefined"
        >
          <span class="rv-kicker">{{ t(`home.hero.kicker.${state}`) }}</span>
          <h1>{{ t('home.hero.title') }}</h1>
          <p v-if="!size.narrow && size.width >= 3 && size.height >= 2">
            {{ t(`home.hero.lead.${state}`) }}
          </p>
          <div
            v-if="size.narrow || size.width >= 3 && size.height >= 2"
            class="rv-bento-actions"
          >
            <button
              type="button"
              class="rv-btn rv-btn-primary"
              aria-controls="bento-back-cta"
              @click="openCard('cta')"
            >
              {{ t(state === 'live' ? 'header.addToDiscord' : 'header.joinBeta') }}
            </button>
            <NuxtLink
              v-if="state === 'live' && docsBuilt"
              :to="localePath('/docs')"
            >
              {{ t('home.hero.readDocs') }}
            </NuxtLink>
          </div>
        </div>

        <FlipCard
          v-else-if="id === 'cta'"
          :id="id"
          :index="index"
          tone="ink"
          :title="t(`${cta}.title`)"
          :desc="t(`${cta}.desc`)"
          :chips="[{ text: t(`${cta}.chip`), kind: 'cta' }]"
          :open="open"
          :back-label="t(`${cta}.title`)"
          :close-label="t('home.bento.close', { title: t(`${cta}.title`) })"
          :kicker="t(`${cta}.kicker`)"
          :plain-back="state === 'soon'"
          @toggle="toggle"
        >
          <BetaForm
            v-if="state === 'soon'"
            :index="index"
            :title="t(`${cta}.title`)"
            :kicker="t(`${cta}.kicker`)"
          />
          <template v-else>
            <ol class="rv-flip-steps">
              <li
                v-for="(step, n) in steps"
                :key="step.title"
              >
                <span class="rv-flip-step-n">[{{ n + 1 }}]</span>
                <span class="rv-flip-step-title">{{ step.title }}</span>
                <span class="rv-flip-step-text">{{ step.text }}</span>
              </li>
            </ol>
            <div class="rv-flip-links">
              <a
                v-if="reeve.discordInstallUrl"
                class="rv-btn rv-btn-dark"
                :href="reeve.discordInstallUrl"
              >{{ t('header.addToDiscord') }}</a>
              <NuxtLink
                v-if="docsBuilt"
                :to="localePath('/docs')"
              >
                {{ t('home.cards.cta.live.guide') }}
              </NuxtLink>
            </div>
          </template>
        </FlipCard>

        <FlipCard
          v-else
          :id="id"
          :index="index"
          :tone="cardById(id).tone"
          :title="t(`home.cards.${id}.title`)"
          :desc="t(`home.cards.${id}.desc`)"
          :chips="chipsFor(cardById(id))"
          :single="size.width === 1 && size.height === 1"
          :open="open"
          :back-label="t('home.bento.backLabel', { title: t(`home.cards.${id}.title`) })"
          :close-label="t('home.bento.close', { title: t(`home.cards.${id}.title`) })"
          :kicker="t('home.bento.howItWorks')"
          @toggle="toggle"
        >
          <ol class="rv-list">
            <li
              v-for="point in strings(`home.cards.${id}.points`)"
              :key="point"
            >
              {{ point }}
            </li>
          </ol>
          <NuxtLink
            v-if="docsBuilt"
            class="rv-flip-more"
            :to="localePath('/docs')"
          >
            {{ t('home.bento.readDocs', { doc: t(`home.cards.${id}.doc`) }) }}
          </NuxtLink>
        </FlipCard>
      </template>
    </FlipGrid>
  </main>
</template>
