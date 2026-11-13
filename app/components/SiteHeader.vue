<script setup lang="ts">
// Citation SiteHeader, from the Bento-Citation-Soon and -Live boards.
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { launched, header, action, signIn } = useSiteLinks()

// The menu repeats the nav and the actions; with nothing to list there is no Menu button.
const hasMenu = computed(() => header.value.length > 0 || Boolean(action.value || signIn.value))
const menuOpen = ref(false)
const menuId = useId()

// Close the menu when the page changes, and on Escape (focus returns to the Menu button).
const menuButton = useTemplateRef<HTMLButtonElement>('menuButton')
watch(() => route.fullPath, () => {
  menuOpen.value = false
})
// The menu only shows below breakpoint-nav. If the header widens past it while the menu is open, close the
// menu so it doesn't reappear open, with aria-expanded still true, when the header narrows again.
const headerEl = useTemplateRef<HTMLElement>('headerEl')
let observer: ResizeObserver | undefined
onMounted(() => {
  if (!headerEl.value) return
  const navBreakpoint = Number.parseFloat(getComputedStyle(headerEl.value).getPropertyValue('--breakpoint-nav'))
  observer = new ResizeObserver(([entry]) => {
    if (menuOpen.value && entry && entry.contentRect.width >= navBreakpoint) menuOpen.value = false
  })
  observer.observe(headerEl.value)
})
onBeforeUnmount(() => observer?.disconnect())

function closeOnEscape() {
  if (!menuOpen.value) return
  menuOpen.value = false
  menuButton.value?.focus()
}
</script>

<template>
  <header
    ref="headerEl"
    class="rv-header"
    @keydown.escape="closeOnEscape"
  >
    <div class="rv-header-in">
      <SiteLogo>
        <span
          v-if="!launched"
          class="rv-badge"
        >{{ t('header.badge') }}</span>
      </SiteLogo>
      <nav
        v-if="header.length"
        class="rv-nav"
        :aria-label="t('header.navLabel')"
      >
        <NuxtLink
          v-for="link in header"
          :key="link.to"
          :to="localePath(link.to)"
        >
          {{ t(link.label) }}
        </NuxtLink>
      </nav>
      <div
        v-if="action || signIn"
        class="rv-header-actions"
      >
        <NuxtLink
          v-if="signIn"
          class="rv-signin"
          :to="localePath(signIn.to)"
        >
          {{ t(signIn.label) }}
        </NuxtLink>
        <NuxtLink
          v-if="action"
          class="rv-btn rv-btn-primary rv-btn-s"
          :to="localePath(action.to)"
        >
          {{ t(action.label) }}
        </NuxtLink>
      </div>
      <button
        v-if="hasMenu"
        ref="menuButton"
        type="button"
        class="rv-menu-btn"
        :aria-expanded="menuOpen"
        :aria-controls="menuId"
        @click="menuOpen = !menuOpen"
      >
        {{ t('header.menu') }}
      </button>
    </div>
    <nav
      v-if="hasMenu"
      :id="menuId"
      class="rv-menu"
      :aria-label="t('header.navLabel')"
      :hidden="!menuOpen"
    >
      <NuxtLink
        v-for="link in header"
        :key="link.to"
        :to="localePath(link.to)"
      >
        {{ t(link.label) }}
      </NuxtLink>
      <NuxtLink
        v-if="signIn"
        :to="localePath(signIn.to)"
      >
        {{ t(signIn.label) }}
      </NuxtLink>
      <NuxtLink
        v-if="action"
        class="rv-btn rv-btn-primary rv-btn-s"
        :to="localePath(action.to)"
      >
        {{ t(action.label) }}
      </NuxtLink>
    </nav>
  </header>
</template>
