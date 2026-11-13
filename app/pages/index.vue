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
// Before launch, until the sign-up form is on, nothing invites a request that can't be made.
const signupClosed = computed(() => state.value === 'soon' && !reeve.betaSignup)
const heroAction = computed(() => {
  if (state.value === 'live') return t('header.addToDiscord')
  return signupClosed.value ? t('home.cards.cta.soon.closed.hero') : t('header.joinBeta')
})
const ctaTitle = computed(() => (signupClosed.value ? t('home.cards.cta.soon.closed.title') : t(`${cta.value}.title`)))
const ctaChip = computed<Chip>(() => signupClosed.value
  ? { text: t('home.cards.cta.soon.closed.chip'), kind: 'plain' }
  : { text: t(`${cta.value}.chip`), kind: 'cta' })
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
      <template #default="{ id, index, open, toggle, openCard }">
        <div
          v-if="id === 'hero'"
          class="rv-bento-hero"
        >
          <span class="rv-kicker">{{ t(`home.hero.kicker.${state}`) }}</span>
          <h1>{{ t('home.hero.title') }}</h1>
          <p class="rv-bento-lead">
            {{ t(`home.hero.lead.${state}`) }}
          </p>
          <div class="rv-bento-actions">
            <button
              type="button"
              class="rv-btn rv-btn-primary"
              aria-controls="bento-back-cta"
              @click="openCard('cta')"
            >
              {{ heroAction }}
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
          :title="ctaTitle"
          :desc="t(`${cta}.desc`)"
          :chips="[ctaChip]"
          :open="open"
          :back-label="ctaTitle"
          :close-label="t('home.bento.close', { title: ctaTitle })"
          :kicker="t(`${cta}.kicker`)"
          :plain-back="state === 'soon'"
          @toggle="toggle"
        >
          <BetaForm
            v-if="state === 'soon'"
            :index="index"
            :title="ctaTitle"
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
