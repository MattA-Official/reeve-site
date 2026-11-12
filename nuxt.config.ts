// https://nuxt.com/docs/api/configuration/nuxt-config
// The domain is not decided yet. `.invalid` is reserved and can never resolve,
// so nothing built with the fallback can be mistaken for the real site.
// Set NUXT_PUBLIC_SITE_URL once the domain is chosen.
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL ?? 'https://reeve.invalid'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    'nuxt-llms',
    'nuxt-security',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@nuxt/a11y',
    '@nuxt/hints',
  ],

  devtools: { enabled: true },

  site: {
    url: siteUrl,
    name: 'Reeve',
    defaultLocale: 'en-GB',
  },

  content: {
    experimental: {
      // Node 22.5+ ships SQLite, so no native add-on is needed.
      sqliteConnector: 'native',
    },
  },

  compatibilityDate: '2026-11-12',

  // Every page is prerendered. Server routes come later, for sign-up and payment.
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  typescript: {
    strict: true,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  fonts: {
    families: [
      { name: 'Atkinson Hyperlegible', provider: 'google', weights: [400, 700] },
      { name: 'Spline Sans Mono', provider: 'google', weights: [400, 500] },
    ],
  },

  i18n: {
    defaultLocale: 'en-GB',
    strategy: 'prefix_except_default',
    baseUrl: siteUrl,
    locales: [
      { code: 'en-GB', language: 'en-GB', name: 'English (UK)', file: 'en-GB.json' },
    ],
  },

  llms: {
    domain: siteUrl,
    title: 'Reeve',
    description: 'Moderation for a single Discord community: cases, reports, tickets and appeals, with AI that may only take small actions a person can undo.',
  },

  // OG images are switched on when the page designs are built.
  ogImage: {
    enabled: false,
  },

  sitemap: {
    zeroRuntime: true,
  },
})
