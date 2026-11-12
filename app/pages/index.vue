<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('site.name'),
  description: () => t('site.description'),
})
</script>

<template>
  <main>
    <h1>{{ t('site.name') }}</h1>
    <p>{{ t('site.holding') }}</p>
  </main>
</template>
