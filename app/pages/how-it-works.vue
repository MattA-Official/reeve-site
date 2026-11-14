<!-- Boards: Site-Citation-HowItWorks-Soon, Site-Citation-HowItWorks-Live, and their -Phone versions -->
<script setup lang="ts">
// Every claim here was checked against Warden; keep it that way when the bot changes.
import type { Chip } from '~/components/FlipCard.vue'

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const { isBuilt } = useSiteLinks()

useSeoMeta({
  title: () => t('howItWorks.title'),
  description: () => t('howItWorks.description'),
})

const strings = (key: string) => (tm(key) as unknown as string[]).map(s => rt(s))
const pairs = (key: string) => (tm(key) as unknown as string[][]).map(([label, value]) => [rt(label!), rt(value!)] as const)

const sections = ['flow', 'members', 'tickets', 'team'] as const

// Card order, tones and chip kinds come from the board; the words come from the locale file.
const steps = [
  { id: 'report', tone: 'card', chips: ['status'] },
  { id: 'case', tone: 'special', chips: ['ref', 'plain'] },
  { id: 'notice', tone: 'tint', chips: ['plain'] },
  { id: 'appeal', tone: 'accent', chips: ['ui'] },
  { id: 'concern', tone: 'card', chips: ['ui'] },
  { id: 'digest', tone: 'ink', chips: ['plain'] },
] as const
const stepIds = steps.map(step => step.id)
const stepById = (id: string) => steps.find(step => step.id === id)!
const card = (id: string) => `howItWorks.flow.cards.${id}`
const chipsFor = (id: string): Chip[] =>
  strings(`${card(id)}.chips`).map((text, i) => ({ text, kind: stepById(id).chips[i] ?? 'plain' }))
const docsBuilt = computed(() => isBuilt('/docs'))
const hasLink = (id: string) => ['report', 'case', 'appeal'].includes(id)

const view = ref<'member' | 'staff'>('member')
const mock = computed(() => `howItWorks.members.mock.${view.value}`)

const tickets = [
  { id: 'private', tone: 'card' },
  { id: 'forms', tone: 'tint' },
  { id: 'transcripts', tone: 'special' },
] as const
const team = ['lookup', 'escalation', 'permissions', 'staffReports'] as const
</script>

<template>
  <main class="rv-main">
    <div class="rv-grid">
      <div class="rv-hero rv-span-4">
        <span class="rv-kicker">{{ t('howItWorks.kicker') }}</span>
        <h1 class="rv-h1">
          {{ t('howItWorks.heading') }}
        </h1>
        <p class="rv-lead">
          {{ t('howItWorks.lead') }}
        </p>
      </div>
      <div class="rv-card rv-contents rv-tone-ink rv-span-2">
        <span class="rv-contents-label">{{ t('howItWorks.contents.label') }}</span>
        <nav :aria-label="t('howItWorks.contents.nav')">
          <a
            v-for="section in sections"
            :key="section"
            :href="`#${section}`"
          >{{ t(`howItWorks.contents.${section}`) }}</a>
        </nav>
      </div>
    </div>

    <section
      id="flow"
      class="rv-section"
      aria-labelledby="flow-heading"
    >
      <h2
        id="flow-heading"
        class="rv-h2"
      >
        <span
          class="rv-h2-num"
          aria-hidden="true"
        >[1]</span>{{ t('howItWorks.contents.flow') }}
      </h2>
      <p class="rv-intro">
        {{ t('howItWorks.flow.intro') }}
      </p>
      <FlipGrid
        :items="stepIds"
        :layouts="howItWorksBento"
        :label="t('howItWorks.flow.gridLabel')"
      >
        <template #default="{ id, index, open, toggle }">
          <FlipCard
            :id="id"
            :index="index + 1"
            :tone="stepById(id).tone"
            :title="t(`${card(id)}.title`)"
            :desc="t(`${card(id)}.desc`)"
            :chips="chipsFor(id)"
            :open="open"
            :back-label="t('home.bento.backLabel', { title: t(`${card(id)}.title`) })"
            :close-label="t('home.bento.close', { title: t(`${card(id)}.title`) })"
            :kicker="t('home.bento.howItWorks')"
            @toggle="toggle"
          >
            <ol class="rv-list">
              <li
                v-for="point in strings(`${card(id)}.points`)"
                :key="point"
              >
                {{ point }}
              </li>
            </ol>
            <NuxtLink
              v-if="docsBuilt && hasLink(id)"
              class="rv-flip-more"
              :to="localePath('/docs')"
            >
              {{ t(`${card(id)}.link`) }}
            </NuxtLink>
          </FlipCard>
        </template>
      </FlipGrid>
    </section>

    <section
      id="members"
      class="rv-section"
      aria-labelledby="members-heading"
    >
      <h2
        id="members-heading"
        class="rv-h2"
      >
        <span
          class="rv-h2-num"
          aria-hidden="true"
        >[2]</span>{{ t('howItWorks.contents.members') }}
      </h2>
      <p class="rv-intro">
        {{ t('howItWorks.members.intro') }}
      </p>
      <div class="rv-grid rv-grid-side">
        <div class="rv-card rv-tone-card">
          <span class="rv-tag">{{ t('howItWorks.members.shape.tag') }}</span>
          <h3 class="rv-title rv-title-m">
            {{ t('howItWorks.members.shape.title') }}
          </h3>
          <ol class="rv-list">
            <li
              v-for="point in strings('howItWorks.members.shape.points')"
              :key="point"
            >
              {{ point }}
            </li>
          </ol>
          <p class="rv-text rv-text-s">
            {{ t('howItWorks.members.shape.note') }}
          </p>
        </div>
        <div class="rv-hiw-views">
          <div
            class="rv-seg"
            role="group"
            :aria-label="t('howItWorks.members.views.label')"
          >
            <button
              v-for="option in (['member', 'staff'] as const)"
              :key="option"
              type="button"
              :aria-pressed="view === option ? 'true' : 'false'"
              @click="view = option"
            >
              {{ t(`howItWorks.members.views.${option}`) }}
            </button>
          </div>
          <figure class="rv-hiw-mock">
            <figcaption class="rv-sr">
              {{ t('howItWorks.members.mock.exampleNote') }}
            </figcaption>
            <div
              aria-live="polite"
              aria-atomic="true"
            >
              <DiscordMessage
                :name="t('howItWorks.members.mock.name')"
                :app="t('howItWorks.members.mock.app')"
                :time="t('howItWorks.members.mock.time')"
                :title="t(`${mock}.title`)"
                :fields="pairs(`${mock}.fields`)"
                :text="t(`${mock}.text`)"
                :buttons="strings(`${mock}.buttons`)"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>

    <section
      id="tickets"
      class="rv-section"
      aria-labelledby="tickets-heading"
    >
      <h2
        id="tickets-heading"
        class="rv-h2"
      >
        <span
          class="rv-h2-num"
          aria-hidden="true"
        >[3]</span>{{ t('howItWorks.contents.tickets') }}
      </h2>
      <p class="rv-intro">
        {{ t('howItWorks.tickets.intro') }}
      </p>
      <div class="rv-grid rv-grid-3">
        <div
          v-for="item in tickets"
          :key="item.id"
          :class="['rv-card', `rv-tone-${item.tone}`]"
        >
          <span class="rv-tag">{{ t(`howItWorks.tickets.cards.${item.id}.tag`) }}</span>
          <h3 class="rv-title">
            {{ t(`howItWorks.tickets.cards.${item.id}.title`) }}
          </h3>
          <p class="rv-text">
            {{ t(`howItWorks.tickets.cards.${item.id}.text`) }}
          </p>
        </div>
      </div>
    </section>

    <section
      id="team"
      class="rv-section"
      aria-labelledby="team-heading"
    >
      <h2
        id="team-heading"
        class="rv-h2"
      >
        <span
          class="rv-h2-num"
          aria-hidden="true"
        >[4]</span>{{ t('howItWorks.contents.team') }}
      </h2>
      <div class="rv-grid rv-grid-4">
        <div
          v-for="item in team"
          :key="item"
          class="rv-card rv-tone-card"
        >
          <span class="rv-tag">{{ t(`howItWorks.team.cards.${item}.tag`) }}</span>
          <h3 class="rv-title rv-title-s">
            {{ t(`howItWorks.team.cards.${item}.title`) }}
          </h3>
          <p class="rv-text rv-text-s">
            {{ t(`howItWorks.team.cards.${item}.text`) }}
          </p>
        </div>
      </div>
    </section>

    <CtaBand />
  </main>
</template>
