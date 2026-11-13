<script setup lang="ts">
// Citation BetaForm: the back of the bento's call-to-action card. Posts to the sign-up API.
defineProps<{ index: number, title: string, kicker: string }>()

const { t } = useI18n()
const { betaEndpoint } = useRuntimeConfig().public
const { reeve } = useAppConfig()

const localePath = useLocalePath()
const server = ref('')
const website = ref('')
const role = ref<'owner' | 'admin' | 'moderator'>('owner')
const members = ref<'small' | 'medium' | 'large'>('small')
const email = ref('')
const state = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle')
const sent = ref({ server: '', email: '' })

const firstField = useTemplateRef<HTMLInputElement>('firstField')
const done = useTemplateRef<HTMLElement>('done')

async function submit() {
  state.value = 'sending'
  try {
    await $fetch(betaEndpoint, {
      method: 'POST',
      body: { server: server.value.trim(), role: role.value, members: members.value, email: email.value.trim(), website: website.value },
    })
    sent.value = { server: server.value.trim(), email: email.value.trim() }
    state.value = 'sent'
    await nextTick()
    done.value?.focus()
  }
  catch {
    state.value = 'failed'
  }
}

async function again() {
  server.value = ''
  state.value = 'idle'
  await nextTick()
  firstField.value?.focus()
}
</script>

<template>
  <div class="rv-betaform">
    <div class="rv-betaform-copy">
      <span class="rv-flip-kicker">[{{ index }}] {{ kicker }}</span>
      <span class="rv-flip-backtitle">{{ title }}</span>
      <p>{{ t('home.beta.why') }}</p>
      <p v-if="reeve.betaSignup">
        {{ t('home.beta.email', reeve.privacy) }}
      </p>
      <p v-else>
        {{ t('home.cards.cta.soon.closed.note') }}
      </p>
    </div>
    <template v-if="!reeve.betaSignup" />
    <form
      v-else-if="state !== 'sent'"
      class="rv-betaform-fields"
      @submit.prevent="submit"
    >
      <label class="rv-field">{{ t('home.beta.server') }}<input
        ref="firstField"
        v-model="server"
        class="rv-input"
        type="text"
        name="server"
        autocomplete="off"
        required
        maxlength="100"
        :placeholder="t('home.beta.serverExample')"
      ></label>
      <label class="rv-field">{{ t('home.beta.role') }}<select
        v-model="role"
        class="rv-input"
        name="role"
      >
        <option value="owner">{{ t('home.beta.roles.owner') }}</option>
        <option value="admin">{{ t('home.beta.roles.admin') }}</option>
        <option value="moderator">{{ t('home.beta.roles.moderator') }}</option>
      </select></label>
      <label class="rv-field">{{ t('home.beta.members') }}<select
        v-model="members"
        class="rv-input"
        name="members"
      >
        <option value="small">{{ t('home.beta.sizes.small') }}</option>
        <option value="medium">{{ t('home.beta.sizes.medium') }}</option>
        <option value="large">{{ t('home.beta.sizes.large') }}</option>
      </select></label>
      <label class="rv-field">{{ t('home.beta.emailLabel') }}<input
        v-model="email"
        class="rv-input"
        type="email"
        name="email"
        autocomplete="email"
        required
        maxlength="254"
        :placeholder="t('home.beta.emailExample')"
      ></label>
      <!-- Hidden from people and assistive technology; only bots fill it in. -->
      <label
        class="rv-sr"
        aria-hidden="true"
      >{{ t('home.beta.honeypot') }}<input
        v-model="website"
        type="text"
        name="website"
        tabindex="-1"
        autocomplete="off"
      ></label>
      <p class="rv-betaform-notice">
        {{ t('home.beta.notice', reeve.privacy) }}
        <NuxtLink :to="localePath('/privacy')">{{ t('home.beta.noticeLink') }}</NuxtLink>
      </p>
      <p
        v-if="state === 'failed'"
        class="rv-betaform-error"
        role="alert"
      >
        {{ t('home.beta.failed') }}
      </p>
      <button
        type="submit"
        class="rv-btn rv-btn-dark"
        :disabled="state === 'sending'"
      >
        {{ state === 'sending' ? t('home.beta.sending') : t('home.beta.submit') }}
      </button>
    </form>
    <div
      v-else
      ref="done"
      class="rv-betaform-done"
      role="status"
      tabindex="-1"
    >
      <span class="rv-flip-kicker">[{{ t('home.beta.doneKicker') }}]</span>
      <span class="rv-betaform-done-title">{{ t('home.beta.doneTitle') }}</span>
      <span class="rv-betaform-done-text">{{ t('home.beta.doneText', sent) }}</span>
      <button
        type="button"
        class="rv-btn rv-btn-ghost rv-btn-s rv-betaform-again"
        @click="again"
      >
        {{ t('home.beta.again') }}
      </button>
    </div>
  </div>
</template>
