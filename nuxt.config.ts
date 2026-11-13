// https://nuxt.com/docs/api/configuration/nuxt-config
// The domain is not decided yet. `.invalid` is reserved and can never resolve,
// so nothing built with the fallback can be mistaken for the real site.
// Set NUXT_PUBLIC_SITE_URL once the domain is chosen. An empty value counts as unset.
const configuredUrl = process.env.NUXT_PUBLIC_SITE_URL?.trim()
const siteUrl = configuredUrl || 'https://reeve.invalid'
const onCloudflare = process.env.NITRO_PRESET?.startsWith('cloudflare') ?? false
const purgeSchedule = '0 3 * * *'

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
    '@nuxthub/core',
  ],

  devtools: { enabled: true },
  css: ['~/assets/css/tokens.css', '~/assets/css/citation.css', '~/assets/css/site.css'],

  site: {
    url: siteUrl,
    name: 'Reeve',
    defaultLocale: 'en-GB',
    // Only a build for the real domain may be indexed.
    indexable: Boolean(configuredUrl),
  },

  content: {
    experimental: {
      // Node 22.5+ ships SQLite, so no native add-on is needed.
      sqliteConnector: 'native',
    },
  },

  runtimeConfig: {
    public: {
      // Where the beta form posts (server/api/beta.post.ts).
      betaEndpoint: '/api/beta',
    },
  },

  // A handful of sign-up requests per IP address every ten minutes (nuxt-security lets six through before
  // answering 429). The address is counted in memory for that
  // window only and never stored or logged. On Workers each instance keeps its own count, so this slows
  // abuse rather than stopping it. Cloudflare's own header is used there, because X-Forwarded-For can be forged.
  routeRules: {
    '/api/beta': {
      security: {
        rateLimiter: {
          tokensPerInterval: 5,
          interval: 600_000,
          ipHeader: onCloudflare ? 'cf-connecting-ip' : undefined,
        },
      },
    },
  },

  compatibilityDate: '2026-11-12',

  // Every page is prerendered; only /api routes run on the server.
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
    experimental: { tasks: true },
    // Retention for beta sign-up requests, daily at 03:00 UTC.
    scheduledTasks: { [purgeSchedule]: ['beta:purge'] },
    // Nitro runs the task when the Worker's Cron Trigger fires, but doesn't declare the trigger itself.
    cloudflare: { wrangler: { triggers: { crons: [purgeSchedule] } } },
  },

  // NuxtHub: a local SQLite file in development and CI; Cloudflare D1 when built with
  // NITRO_PRESET=cloudflare_module and NUXT_HUB_D1_DATABASE_ID set.
  hub: {
    db: {
      dialect: 'sqlite',
      connection: { databaseId: process.env.NUXT_HUB_D1_DATABASE_ID },
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

  security: {
    headers: {
      contentSecurityPolicy: {
        // Fonts are self-hosted and there are no third-party styles.
        'style-src': ['\'self\'', '\'unsafe-inline\''],
        'font-src': ['\'self\'', 'data:'],
      },
    },
    // Nuxt 4.6 builds with oxc, which ignores this option's esbuild setting.
    removeLoggers: false,
  },

  sitemap: {
    zeroRuntime: true,
  },
})
