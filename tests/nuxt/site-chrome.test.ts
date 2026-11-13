import { afterEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { VueWrapper } from '@vue/test-utils'
import SiteHeader from '~/components/SiteHeader.vue'
import SiteFooter from '~/components/SiteFooter.vue'

// Vue Test Utils has no role queries, so these select by element, ARIA attribute and text.
const allPages = ['/how-it-works', '/ai-moderation', '/privacy', '/pricing', '/docs', '/changelog', '/status',
  '/pilot', '/about', '/support', '/legal', '/sign-up', '/dashboard']

function setSite(settings: { launched?: boolean, builtPages?: string[], company?: { name: string, number: string } }) {
  const { reeve } = useAppConfig()
  Object.assign(reeve, settings)
}

const texts = (wrapper: Pick<VueWrapper, 'findAll'>, selector: string) => wrapper.findAll(selector).map(el => el.text())
// The wide nav and the actions are the header row's links outside the Menu list.
const siteNav = (header: VueWrapper) => header.findAll('nav[aria-label="Site"]:not([id])')
const actionLinks = (header: VueWrapper) => texts(header, 'header > div > div a')
const menuButton = (header: VueWrapper) => header.find('button[aria-expanded]')

afterEach(() => setSite({ launched: false, builtPages: [], company: { name: '', number: '' } }))

describe('SiteHeader', () => {
  it('links only to pages that exist', async () => {
    setSite({ builtPages: ['/docs'] })
    const header = await mountSuspended(SiteHeader)
    expect(texts(siteNav(header)[0]!, 'a')).toEqual(['Docs'])
    expect(actionLinks(header)).toEqual([])
  })

  it('before launch names the logo link with the private beta badge and offers Join the beta', async () => {
    setSite({ builtPages: allPages })
    const header = await mountSuspended(SiteHeader)
    expect(header.get('a[href="/"]').text()).toMatch(/Reeve home\s*private beta/)
    expect(actionLinks(header)).toEqual(['Join the beta'])
    expect(siteNav(header)[0]!.findAll('a')).toHaveLength(5)
  })

  it('after launch offers Sign in and Add to Discord, and drops the badge', async () => {
    setSite({ launched: true, builtPages: allPages })
    const header = await mountSuspended(SiteHeader)
    expect(header.get('a[href="/"]').text()).not.toContain('private beta')
    expect(actionLinks(header)).toEqual(['Sign in', 'Add to Discord'])
  })

  it('has no Menu button when there is nothing to list', async () => {
    const header = await mountSuspended(SiteHeader)
    expect(menuButton(header).exists()).toBe(false)
  })

  it('the Menu button opens and closes the menu and reports it in aria-expanded', async () => {
    setSite({ builtPages: allPages })
    const header = await mountSuspended(SiteHeader)
    const button = menuButton(header)
    expect(button.text()).toBe('Menu')
    const menu = header.get(`nav#${button.attributes('aria-controls')}`)
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
    const links = texts(footer, 'nav a')
    expect(links).toContain('The pilot')
    expect(links).not.toContain('Sign in')
    expect(footer.findAll('nav').map(n => n.attributes('aria-label'))).toEqual(['Product', 'Resources', 'Company'])
  })

  it('after launch lists Pilot write-up and Sign in', async () => {
    setSite({ launched: true, builtPages: allPages })
    const links = texts(await mountSuspended(SiteFooter), 'nav a')
    expect(links).toContain('Pilot write-up')
    expect(links).toContain('Sign in')
  })

  it('hides the company line until the company is set, and never shows a placeholder', async () => {
    const before = await mountSuspended(SiteFooter)
    expect(before.get('footer').text()).not.toContain('Registered in England and Wales')
    expect(before.get('footer').text()).toContain('Reeve is not affiliated with Discord Inc.')
    setSite({ company: { name: 'Example', number: '01234567' } })
    const after = await mountSuspended(SiteFooter)
    expect(after.get('footer').text()).toMatch(/© \d{4} Example Ltd · Registered in England and Wales, no\. 01234567/)
    expect(after.html()).not.toMatch(/\[[A-Z ]+\]/)
  })
})
