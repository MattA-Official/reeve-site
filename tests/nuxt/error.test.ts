import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErrorPage from '~/error.vue'

// createError builds a real NuxtError, as Nuxt passes to the error page.
const error = (statusCode: number, message?: string) => createError({ statusCode, message })

describe('error page', () => {
  it('shows the not-found copy and only the home card while no other pages exist', async () => {
    const page = await mountSuspended(ErrorPage, { props: { error: error(404, 'Page not found: /nope') } })
    expect(page.get('h1').text()).toBe('This page isn\'t here')
    expect(page.get('.rv-kicker').text()).toBe('404')
    expect(page.findAll('h2').map(h => h.text())).toEqual(['Start again'])
  })

  it('shows the docs and support cards once those pages are built', async () => {
    const { reeve } = useAppConfig()
    const before = [...reeve.builtPages]
    reeve.builtPages.push('/docs', '/support')
    try {
      const page = await mountSuspended(ErrorPage, { props: { error: error(404) } })
      expect(page.findAll('h2').map(h => h.text())).toEqual(['Start again', 'Looking for a guide?', 'Still stuck?'])
    }
    finally {
      reeve.builtPages.splice(0, reeve.builtPages.length, ...before)
    }
  })

  it('shows plain copy for other errors and never the error message', async () => {
    const page = await mountSuspended(ErrorPage, { props: { error: error(500, 'SQLITE_BUSY: database is locked') } })
    expect(page.get('h1').text()).toBe('Something went wrong')
    expect(page.get('.rv-kicker').text()).toBe('500')
    expect(page.text()).not.toContain('SQLITE_BUSY')
  })

  it('names the site in the tab title', () => {
    // A bare | in a message is vue-i18n's plural separator, so the titles escape it.
    const { t } = useNuxtApp().$i18n
    expect(t('error.notFound.pageTitle')).toBe('This page isn\'t here | Reeve')
    expect(t('error.failed.pageTitle')).toBe('Something went wrong | Reeve')
  })
})
