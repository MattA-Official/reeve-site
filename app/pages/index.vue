<script setup lang="ts">
const { t } = useI18n()

// The home page title is the site name alone, without the "| Reeve" suffix.
useHead({ titleTemplate: '%s' })
useSeoMeta({
  title: () => t('site.name'),
  description: () => t('site.description'),
})
</script>

<template>
  <main class="rv-main">
    <h1>{{ t('site.name') }}</h1>
    <p>{{ t('site.holding') }}</p>
  </main>
</template>
