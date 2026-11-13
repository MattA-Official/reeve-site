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

// `website` is a field people can't see; only bots fill it in.
export function isHoneypotFilled(body: unknown): boolean {
  return Boolean(body && typeof body === 'object' && (body as Record<string, unknown>).website)
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
