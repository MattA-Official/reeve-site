import { afterEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

afterEach(() => {
  Object.assign(useAppConfig().reeve, { launched: false, discordInstallUrl: '' })
})

describe('home page', () => {
  it('has one heading, the hero title', async () => {
    const page = await mountSuspended(IndexPage)
    const headings = page.findAll('h1')
    expect(headings).toHaveLength(1)
    expect(headings[0]?.text()).toBe('A Discord moderation bot that records every action and tells members why.')
  })

  it('renders the nine cards closed, each front naming its back', async () => {
    const page = await mountSuspended(IndexPage)
    const fronts = page.findAll('button[aria-expanded]')
    expect(fronts).toHaveLength(9)
    for (const front of fronts) {
      expect(front.attributes('aria-expanded')).toBe('false')
      expect(page.find(`[id="${front.attributes('aria-controls')}"][role="region"]`).exists()).toBe(true)
    }
  })

  it('opens a card, hides its front, and closes again with Escape', async () => {
    const page = await mountSuspended(IndexPage)
    const front = page.get('button[aria-controls="bento-back-cases"]')
    await front.trigger('click')
    const back = page.get('#bento-back-cases')
    expect(front.attributes('aria-expanded')).toBe('true')
    expect(front.attributes('inert')).toBeDefined()
    expect(back.attributes('inert')).toBeUndefined()
    expect(back.attributes('aria-label')).toBe('Cases: how it works')
    expect(back.findAll('li')).toHaveLength(4)
    await back.trigger('keydown', { key: 'Escape' })
    expect(front.attributes('aria-expanded')).toBe('false')
    expect(back.attributes('inert')).toBeDefined()
  })

  it('opens only one card at a time', async () => {
    const page = await mountSuspended(IndexPage)
    await page.get('button[aria-controls="bento-back-cases"]').trigger('click')
    await page.get('[data-back="cases"]').trigger('click')
    await page.get('button[aria-controls="bento-back-rules"]').trigger('click')
    expect(page.findAll('button[aria-expanded="true"]')).toHaveLength(1)
  })

  it('the hero action opens the beta card', async () => {
    const page = await mountSuspended(IndexPage)
    await page.get('.rv-bento-actions button').trigger('click')
    expect(page.get('button[aria-controls="bento-back-cta"]').attributes('aria-expanded')).toBe('true')
  })
  it('after launch, the last card shows the four set-up steps and Add to Discord', async () => {
    Object.assign(useAppConfig().reeve, { launched: true, discordInstallUrl: 'https://discord.com/oauth2/authorize?client_id=1' })
    const page = await mountSuspended(IndexPage)
    expect(page.get('.rv-bento-hero .rv-kicker').text()).toBe('discord moderation')
    const back = page.get('#bento-back-cta')
    expect(back.attributes('aria-label')).toBe('Start using Reeve')
    expect(back.findAll('ol > li')).toHaveLength(4)
    expect(back.get('a.rv-btn').text()).toBe('Add to Discord')
    expect(back.find('form').exists()).toBe(false)
  })
})
