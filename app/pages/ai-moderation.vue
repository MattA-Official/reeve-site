<!-- Boards: Site-Citation-AI-Soon, Site-Citation-AI-Live, and their -Phone versions -->
<script setup lang="ts">
// Every claim here was checked against Warden's code and DPIAs; keep it that way when the bot changes. The
// board's quarantine, Gemini, EEA, plan-quota, no-training and bias-testing claims are left out because
// Warden doesn't back them yet.
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const { isBuilt } = useSiteLinks()

useSeoMeta({
  title: () => t('ai.title'),
  description: () => t('ai.description'),
})

const strings = (key: string) => (tm(key) as unknown as string[]).map(s => rt(s))
const lists = (key: string) => (tm(key) as unknown as string[][]).map(row => row.map(s => rt(s)))

const sections = ['stages', 'limits', 'override', 'never', 'checks'] as const

const stages = [
  { id: 'screen', tone: 'card' },
  { id: 'review', tone: 'tint' },
  { id: 'act', tone: 'accent' },
] as const
const showExample = ref(false)

const limitCards = ['recorded', 'control', 'members'] as const

type Decision = 'uphold' | 'reverse' | 'change'
const decisions: Decision[] = ['uphold', 'reverse', 'change']
const decision = ref<Decision | null>(null)
const status = computed(() => strings(`ai.override.mock.status.${decision.value ?? 'open'}`))

// The fourth card takes the special tone, as on the board.
const neverTone = (index: number) => (index === 3 ? 'special' : 'card')
const checkCards = ['before', 'after', 'monthly'] as const
</script>

<template>
  <main class="rv-main">
    <div class="rv-grid">
      <div class="rv-hero rv-span-4">
        <span class="rv-kicker">{{ t('ai.kicker') }}</span>
        <h1 class="rv-h1">
          {{ t('ai.heading') }}
        </h1>
        <p class="rv-lead">
          {{ t('ai.lead') }}
        </p>
      </div>
      <div class="rv-card rv-contents rv-tone-ink rv-span-2">
        <span class="rv-contents-label">{{ t('ai.contents.label') }}</span>
        <nav :aria-label="t('ai.contents.nav')">
          <a
            v-for="section in sections"
            :key="section"
            :href="`#${section}`"
          >{{ t(`ai.contents.${section}`) }}</a>
        </nav>
      </div>
    </div>

    <section
      id="stages"
      class="rv-section"
      aria-labelledby="stages-heading"
    >
      <h2
        id="stages-heading"
        class="rv-h2"
      >
        <span
          class="rv-h2-num"
          aria-hidden="true"
        >[1]</span>{{ t('ai.stages.heading') }}
      </h2>
      <p class="rv-intro">
        {{ t('ai.stages.intro') }}
      </p>
      <div class="rv-grid rv-grid-3">
        <div
          v-for="stage in stages"
          :key="stage.id"
          :class="['rv-card', `rv-tone-${stage.tone}`]"
        >
          <span class="rv-tag">{{ t(`ai.stages.${stage.id}.tag`) }}</span>
          <h3 class="rv-title rv-title-m">
            {{ t(`ai.stages.${stage.id}.title`) }}
          </h3>
          <p
            v-for="text in strings(`ai.stages.${stage.id}.text`)"
            :key="text"
            class="rv-text"
          >
            {{ text }}
          </p>
          <div
            v-if="stage.id !== 'act'"
            class="rv-chips"
          >
            <span
              v-for="chip in strings(`ai.stages.${stage.id}.chips`)"
              :key="chip"
              class="rv-chip"
            >{{ chip }}</span>
          </div>
          <template v-if="stage.id === 'review'">
            <button
              type="button"
              class="rv-textbtn"
              aria-controls="ai-example"
              :aria-expanded="showExample ? 'true' : 'false'"
              @click="showExample = !showExample"
            >
              {{ t('ai.stages.review.show') }}
            </button>
            <div
              id="ai-example"
              class="rv-ai-pseudo"
              role="group"
              :aria-label="t('ai.stages.review.example.label')"
              :hidden="!showExample"
            >
              <span class="rv-ai-pseudo-label">{{ t('ai.stages.review.example.before') }}</span>
              <span
                v-for="[name, , text] in lists('ai.stages.review.example.lines')"
                :key="`before-${name}`"
              >{{ name }}: {{ text }}</span>
              <span class="rv-ai-pseudo-label">{{ t('ai.stages.review.example.after') }}</span>
              <span
                v-for="[name, label, text] in lists('ai.stages.review.example.lines')"
                :key="`after-${name}`"
              ><span class="rv-ai-pseudo-name">{{ label }}</span>: {{ text }}</span>
            </div>
          </template>
        </div>
      </div>
    </section>

    <section
      id="limits"
      class="rv-section"
      aria-labelledby="limits-heading"
    >
      <h2
        id="limits-heading"
        class="rv-h2"
      >
        <span
          class="rv-h2-num"
          aria-hidden="true"
        >[2]</span>{{ t('ai.limits.heading') }}
      </h2>
      <div class="rv-grid">
        <div
          v-for="(item, key) in { may: 'accent', never: 'ink' }"
          :key="key"
          :class="['rv-card', 'rv-span-3', `rv-tone-${item}`]"
        >
          <span class="rv-tag">{{ t(`ai.limits.${key}.tag`) }}</span>
          <h3 class="rv-title rv-title-l">
            {{ t(`ai.limits.${key}.title`) }}
          </h3>
          <ol class="rv-list rv-ai-limits-list">
            <li
              v-for="point in strings(`ai.limits.${key}.points`)"
              :key="point"
            >
              {{ point }}
            </li>
          </ol>
        </div>
        <div
          v-for="item in limitCards"
          :key="item"
          class="rv-card rv-tone-card rv-span-2"
        >
          <span class="rv-tag">{{ t(`ai.limits.cards.${item}.tag`) }}</span>
          <h3 class="rv-title rv-title-s">
            {{ t(`ai.limits.cards.${item}.title`) }}
          </h3>
          <p class="rv-text">
            {{ t(`ai.limits.cards.${item}.text`) }}
          </p>
        </div>
      </div>
    </section>

    <section
      id="override"
      class="rv-section"
      aria-labelledby="override-heading"
    >
      <h2
        id="override-heading"
        class="rv-h2"
      >
        <span
          class="rv-h2-num"
          aria-hidden="true"
        >[3]</span>{{ t('ai.override.heading') }}
      </h2>
      <div class="rv-grid rv-grid-side">
        <div class="rv-card rv-tone-card">
          <span class="rv-tag">{{ t('ai.override.card.tag') }}</span>
          <h3 class="rv-title rv-title-m">
            {{ t('ai.override.card.title') }}
          </h3>
          <ol class="rv-list">
            <li
              v-for="point in strings('ai.override.card.points')"
              :key="point"
            >
              {{ point }}
            </li>
          </ol>
          <p class="rv-text rv-text-s">
            {{ t('ai.override.card.note') }}
          </p>
        </div>
        <figure class="rv-hiw-mock">
          <figcaption class="rv-sr">
            {{ t('ai.override.mock.exampleNote') }}
          </figcaption>
          <DiscordMessage
            :name="t('ai.override.mock.name')"
            :app="t('ai.override.mock.app')"
            :time="t('ai.override.mock.time')"
            :title="t('ai.override.mock.title')"
            :fields="lists('ai.override.mock.fields') as [string, string][]"
            :text="t('ai.override.mock.text')"
            text-first
          >
            <template #actions>
              <div
                class="rv-dc-buttons"
                role="group"
                :aria-label="t('ai.override.mock.label')"
              >
                <button
                  v-for="option in decisions"
                  :key="option"
                  type="button"
                  class="rv-dc-btn rv-ai-decide"
                  :aria-pressed="decision === option ? 'true' : 'false'"
                  @click="decision = option"
                >
                  {{ t(`ai.override.mock.buttons.${option}`) }}
                </button>
              </div>
              <p
                class="rv-dc-result"
                role="status"
              >
                <b>{{ status[0] }}.</b>{{ ' ' }}<span>{{ status[1] }}</span>
              </p>
            </template>
          </DiscordMessage>
        </figure>
      </div>
    </section>

    <section
      id="never"
      class="rv-section"
      aria-labelledby="never-heading"
    >
      <h2
        id="never-heading"
        class="rv-h2"
      >
        <span
          class="rv-h2-num"
          aria-hidden="true"
        >[4]</span>{{ t('ai.never.heading') }}
      </h2>
      <ol
        class="rv-grid rv-ai-never"
        role="list"
      >
        <li
          v-for="(point, index) in strings('ai.never.points')"
          :key="point"
          :class="['rv-card', 'rv-span-2', `rv-tone-${neverTone(index)}`]"
        >
          <span
            class="rv-tag"
            aria-hidden="true"
          >{{ index + 1 }}</span>
          <p class="rv-text">
            {{ point }}
          </p>
        </li>
      </ol>
    </section>

    <section
      id="checks"
      class="rv-section"
      aria-labelledby="checks-heading"
    >
      <h2
        id="checks-heading"
        class="rv-h2"
      >
        <span
          class="rv-h2-num"
          aria-hidden="true"
        >[5]</span>{{ t('ai.checks.heading') }}
      </h2>
      <div class="rv-grid">
        <div
          v-for="item in checkCards"
          :key="item"
          class="rv-card rv-tone-card rv-span-2"
        >
          <span class="rv-tag">{{ t(`ai.checks.cards.${item}.tag`) }}</span>
          <h3 class="rv-title rv-title-s">
            {{ t(`ai.checks.cards.${item}.title`) }}
          </h3>
          <p class="rv-text">
            {{ t(`ai.checks.cards.${item}.text`) }}
          </p>
        </div>
        <div class="rv-card rv-tone-ink rv-span-6">
          <span class="rv-tag">{{ t('ai.checks.limits.tag') }}</span>
          <p class="rv-text rv-ai-limits">
            {{ t('ai.checks.limits.text') }}
          </p>
          <NuxtLink
            v-if="isBuilt('/legal')"
            :to="localePath('/legal')"
          >
            {{ t('ai.checks.limits.link') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <CtaBand />
  </main>
</template>
