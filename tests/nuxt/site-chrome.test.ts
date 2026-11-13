import { afterEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SiteHeader from '~/components/SiteHeader.vue'
import SiteFooter from '~/components/SiteFooter.vue'

const allPages = ['/how-it-works', '/ai-moderation', '/privacy', '/pricing', '/docs', '/changelog', '/status',
  '/pilot', '/about', '/support', '/legal', '/sign-up', '/dashboard']

function setSite(settings: { launched?: boolean, builtPages?: string[], company?: { name: string, number: string } }) {
  const { reeve } = useAppConfig()
  Object.assign(reeve, settings)
}

afterEach(() => setSite({ launched: false, builtPages: [], company: { name: '', number: '' } }))

describe('SiteHeader', () => {
  it('links only to pages that exist', async () => {
    setSite({ builtPages: ['/docs'] })
    const header = await mountSuspended(SiteHeader)
    const nav = header.get('.rv-header-in nav')
    expect(nav.findAll('a').map(a => a.text())).toEqual(['Docs'])
    expect(header.find('.rv-header-actions').exists()).toBe(false)
  })

  it('before launch shows the badge and Join the beta', async () => {
    setSite({ builtPages: allPages })
    const header = await mountSuspended(SiteHeader)
    expect(header.get('.rv-badge').text()).toBe('private beta')
    expect(header.get('.rv-header-actions').findAll('a').map(a => a.text())).toEqual(['Join the beta'])
    expect(header.get('.rv-header-in nav').findAll('a')).toHaveLength(5)
  })

  it('after launch shows Sign in and Add to Discord, and no badge', async () => {
    setSite({ launched: true, builtPages: allPages })
    const header = await mountSuspended(SiteHeader)
    expect(header.find('.rv-badge').exists()).toBe(false)
    expect(header.get('.rv-header-actions').findAll('a').map(a => a.text())).toEqual(['Sign in', 'Add to Discord'])
  })

  it('has no Menu button when there is nothing to list', async () => {
    const header = await mountSuspended(SiteHeader)
    expect(header.find('button.rv-menu-btn').exists()).toBe(false)
  })

  it('the Menu button opens and closes the menu and reports it in aria-expanded', async () => {
    setSite({ builtPages: allPages })
    const header = await mountSuspended(SiteHeader)
    const button = header.get('button.rv-menu-btn')
    const menu = header.get(`#${button.attributes('aria-controls')}`)
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(menu.attributes('hidden')).toBeDefined()
    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(menu.attributes('hidden')).toBeUndefined()
    await header.get('header').trigger('keydown', { key: 'Escape' })
    expect(button.attributes('aria-expanded')).toBe('false')
  })
})

describe('SiteFooter', () => {
  it('before launch lists The pilot and no Sign in', async () => {
    setSite({ builtPages: allPages })
    const footer = await mountSuspended(SiteFooter)
    const links = footer.findAll('nav a').map(a => a.text())
    expect(links).toContain('The pilot')
    expect(links).not.toContain('Sign in')
    expect(footer.findAll('nav').map(n => n.attributes('aria-label'))).toEqual(['Product', 'Resources', 'Company'])
  })

  it('after launch lists Pilot write-up and Sign in', async () => {
    setSite({ launched: true, builtPages: allPages })
    const links = (await mountSuspended(SiteFooter)).findAll('nav a').map(a => a.text())
    expect(links).toContain('Pilot write-up')
    expect(links).toContain('Sign in')
  })

  it('hides the company line until the company is set, and never shows a placeholder', async () => {
    const before = await mountSuspended(SiteFooter)
    expect(before.get('.rv-footer-base').text()).toBe('Reeve is not affiliated with Discord Inc.')
    setSite({ company: { name: 'Example', number: '01234567' } })
    const after = await mountSuspended(SiteFooter)
    expect(after.get('.rv-footer-base').text()).toMatch(/^© \d{4} Example Ltd · Registered in England and Wales, no\. 01234567/)
    expect(after.html()).not.toMatch(/\[[A-Z ]+\]/)
  })
})
