<script setup lang="ts">
// Citation SiteFooter, from the Bento-Citation-Soon and -Live boards.
const { t } = useI18n()
const localePath = useLocalePath()
const { footer } = useSiteLinks()
const { reeve } = useAppConfig()
// Taken once when the page is rendered and carried in the payload, so hydration never shows a different year.
const year = useState('build-year', () => new Date().getFullYear())

// The company line appears only once the company's name and number are set in app.config.ts.
const companyLine = computed(() => {
  const { name, number } = reeve.company
  if (!name || !number) return null
  return t('footer.companyLine', { year: year.value, name, number })
})
</script>

<template>
  <footer class="rv-footer">
    <div class="rv-footer-in">
      <div class="rv-footer-lead">
        <SiteLogo small />
        <p>{{ t('footer.promise') }}</p>
      </div>
      <nav
        v-for="column in footer"
        :key="column.key"
        :aria-label="t(`footer.${column.key}.label`)"
      >
        <span
          class="rv-footer-head"
          aria-hidden="true"
        >{{ t(`footer.${column.key}.head`) }}</span>
        <NuxtLink
          v-for="link in column.links"
          :key="link.to"
          :to="localePath(link.to)"
        >
          {{ t(link.label) }}
        </NuxtLink>
      </nav>
    </div>
    <div class="rv-footer-base">
      <span v-if="companyLine">{{ companyLine }}</span>
      <span>{{ t('footer.notAffiliated') }}</span>
    </div>
  </footer>
</template>
