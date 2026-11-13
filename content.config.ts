import { defineCollection, defineContentConfig } from '@nuxt/content'

// One collection per locale. Add a locale by copying the en-GB entry.
export default defineContentConfig({
  collections: {
    docs_en_gb: defineCollection({
      type: 'page',
      source: {
        include: 'en-GB/docs/**',
        prefix: '/docs',
      },
    }),
  },
})
