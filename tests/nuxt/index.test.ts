import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

describe('home page', () => {
  it('renders the site name as its only heading', async () => {
    const page = await mountSuspended(IndexPage)
    const headings = page.findAll('h1')
    expect(headings).toHaveLength(1)
    expect(headings[0]?.text()).toBe('Reeve')
  })
})
