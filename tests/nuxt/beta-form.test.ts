import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import BetaForm from '~/components/BetaForm.vue'

const received = vi.fn()
registerEndpoint('/api/beta', {
  method: 'POST',
  handler: async (event) => {
    const { readBody, createError } = await import('h3')
    const body = await readBody(event)
    received(body)
    if (body.server === 'Fail') throw createError({ statusCode: 500 })
    return { ok: true }
  },
})

beforeEach(() => {
  useAppConfig().reeve.betaSignup = true
})
afterEach(() => {
  received.mockReset()
  useAppConfig().reeve.betaSignup = false
})

async function fill(form: Awaited<ReturnType<typeof mountSuspended>>, server: string) {
  await form.get('input[name="server"]').setValue(server)
  await form.get('select[name="role"]').setValue('admin')
  await form.get('select[name="members"]').setValue('medium')
  await form.get('input[name="email"]').setValue('mod@example.com')
  await form.get('form').trigger('submit')
  await vi.waitFor(() => expect(received).toHaveBeenCalled())
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('BetaForm', () => {
  it('shows no fields until sign-up is switched on', async () => {
    useAppConfig().reeve.betaSignup = false
    const form = await mountSuspended(BetaForm, { props: { index: 9, title: 'Join the beta', kicker: 'private beta' } })
    expect(form.find('form').exists()).toBe(false)
    expect(form.text()).toContain('We\'re opening Reeve to a few servers at a time')
    expect(form.text()).not.toContain('We\'ll only email you')
  })

  it('has the four labelled fields in order, with the email last', async () => {
    const form = await mountSuspended(BetaForm, { props: { index: 9, title: 'Join the beta', kicker: 'private beta' } })
    expect(form.findAll('label').map(l => l.text().split('\n')[0]?.trim())).toEqual(
      expect.arrayContaining(['Server name', 'Email']),
    )
    expect(form.get('input[name="email"]').attributes()).toMatchObject({ type: 'email', autocomplete: 'email' })
    expect(form.get('button[type="submit"]').text()).toBe('Request a place')
  })

  it('sends the request and says what happens next', async () => {
    const form = await mountSuspended(BetaForm, { props: { index: 9, title: 'Join the beta', kicker: 'private beta' } })
    await fill(form, 'The Reading Room')
    expect(received).toHaveBeenCalledWith({ server: 'The Reading Room', role: 'admin', members: 'medium', email: 'mod@example.com' })
    const done = form.get('[role="status"]')
    expect(done.text()).toContain('You\'re on the list.')
    expect(done.text()).toContain('We\'ll email mod@example.com when a place opens for The Reading Room.')
  })

  it('says so when the request fails, and keeps what was typed', async () => {
    const form = await mountSuspended(BetaForm, { props: { index: 9, title: 'Join the beta', kicker: 'private beta' } })
    await fill(form, 'Fail')
    expect(form.get('[role="alert"]').text()).toContain('We couldn\'t send your request.')
    expect((form.get('input[name="server"]').element as HTMLInputElement).value).toBe('Fail')
  })
})
