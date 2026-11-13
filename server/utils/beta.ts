// Validation and retention rules for beta sign-up requests, kept apart from the route so they can be tested.
export const ROLES = ['owner', 'admin', 'moderator'] as const
export const SIZES = ['small', 'medium', 'large'] as const

export interface BetaRequest {
  server: string
  role: (typeof ROLES)[number]
  members: (typeof SIZES)[number]
  email: string
}

const DAY = 24 * 60 * 60 * 1000
// Kept until a place is offered or declined, plus 30 days; never longer than a year from the request.
export const RETENTION = { afterClose: 30 * DAY, maximum: 365 * DAY }

// A deliberately plain check: one @, something either side, a dot in the domain, no spaces.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// `trap` is a field people can't see; only bots fill it in. It isn't called anything autofill knows,
// so a browser won't fill it for a real person.
export function isHoneypotFilled(body: unknown): boolean {
  return Boolean(body && typeof body === 'object' && (body as Record<string, unknown>).trap)
}

export function parseBetaRequest(body: unknown): BetaRequest | null {
  if (!body || typeof body !== 'object' || isHoneypotFilled(body)) return null
  const { server, role, members, email } = body as Record<string, unknown>
  if (typeof server !== 'string' || typeof email !== 'string') return null
  const cleanServer = server.trim()
  const cleanEmail = email.trim().toLowerCase()
  if (cleanServer.length < 1 || cleanServer.length > 100) return null
  if (cleanEmail.length > 254 || !EMAIL.test(cleanEmail)) return null
  if (!ROLES.includes(role as BetaRequest['role']) || !SIZES.includes(members as BetaRequest['members'])) return null
  return { server: cleanServer, role: role as BetaRequest['role'], members: members as BetaRequest['members'], email: cleanEmail }
}

export function retentionCutoffs(now: Date) {
  return {
    closedBefore: new Date(now.getTime() - RETENTION.afterClose),
    createdBefore: new Date(now.getTime() - RETENTION.maximum),
  }
}

// Turns away requests another site could send on a visitor's behalf. A plain HTML form can't send JSON,
// and a cross-site script sending JSON triggers a CORS preflight that fails. Browsers also say where a
// request came from: anything they mark as cross-site is refused. Clients that aren't browsers send
// neither header and are left to validation and the rate limit.
export function requestProblem(headers: { contentType?: string, fetchSite?: string, origin?: string, host?: string }): 415 | 403 | null {
  if (!headers.contentType?.toLowerCase().startsWith('application/json')) return 415
  if (headers.fetchSite && headers.fetchSite !== 'same-origin') return 403
  if (headers.origin && headers.host) {
    try {
      if (new URL(headers.origin).host !== headers.host) return 403
    }
    catch {
      return 403
    }
  }
  return null
}
