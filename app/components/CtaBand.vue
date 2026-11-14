<script setup lang="ts">
// Citation CtaBand: the accent band that closes a page. It offers only what exists: the sign-up page and the
// pilot page before launch, the install link and pricing after.
const { t } = useI18n()
const localePath = useLocalePath()
const { reeve } = useAppConfig()
const { isBuilt } = useSiteLinks()

const live = computed(() => reeve.launched)
const signupOpen = computed(() => reeve.betaSignup && isBuilt('/sign-up'))
const title = computed(() => {
  if (live.value) return t('band.live.title')
  return signupOpen.value ? t('band.soon.title') : t('band.soon.closedTitle')
})
</script>

<template>
  <section
    class="rv-band"
    aria-labelledby="band-heading"
  >
    <div class="rv-band-copy">
      <h2
        id="band-heading"
        class="rv-title rv-title-2xl"
      >
        {{ title }}
      </h2>
      <p>{{ live ? t('band.live.text') : t('band.soon.text') }}</p>
    </div>
    <div class="rv-band-actions">
      <template v-if="live">
        <a
          v-if="reeve.discordInstallUrl"
          class="rv-btn rv-btn-dark"
          :href="reeve.discordInstallUrl"
        >{{ t('header.addToDiscord') }}</a>
        <NuxtLink
          v-if="isBuilt('/pricing')"
          class="rv-btn rv-btn-ghost"
          :to="localePath('/pricing')"
        >
          {{ t('band.live.pricing') }}
        </NuxtLink>
      </template>
      <template v-else>
        <NuxtLink
          v-if="signupOpen"
          class="rv-btn rv-btn-dark"
          :to="localePath('/sign-up')"
        >
          {{ t('band.soon.join') }}
        </NuxtLink>
        <NuxtLink
          v-if="isBuilt('/pilot')"
          class="rv-btn rv-btn-ghost"
          :to="localePath('/pilot')"
        >
          {{ t('band.soon.pilot') }}
        </NuxtLink>
      </template>
    </div>
  </section>
</template>
