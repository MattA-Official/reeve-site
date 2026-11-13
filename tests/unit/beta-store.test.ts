import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { beforeEach, describe, expect, it } from 'vitest'
import { betaRequests } from '../../server/db/schema'
import type { BetaRequest } from '../../server/utils/beta'
import { RETENTION } from '../../server/utils/beta'
import { purgeBetaRequests, saveBetaRequest } from '../../server/utils/beta-store'

const migration = readFileSync(resolve(__dirname, '../../server/db/migrations/sqlite/0000_beta_requests.sql'), 'utf8')
const request: BetaRequest = { server: 'The Reading Room', role: 'admin', members: 'medium', email: 'mod@example.com' }
const now = new Date('2027-06-01T03:00:00Z')
const ago = (ms: number) => new Date(now.getTime() - ms)
const DAY = 24 * 60 * 60 * 1000

let db: ReturnType<typeof drizzle>

beforeEach(async () => {
  // Each test gets its own in-memory database, built from the real migration.
  const client = createClient({ url: ':memory:' })
  for (const statement of migration.split('--> statement-breakpoint')) await client.execute(statement)
  db = drizzle(client)
})

describe('saving beta requests', () => {
  it('stores a request with its time', async () => {
    await saveBetaRequest(db, request, now)
    expect(await db.select().from(betaRequests)).toEqual([{ id: 1, ...request, createdAt: now, closedAt: null }])
  })

  it('leaves an earlier request untouched when the same address asks again', async () => {
    await saveBetaRequest(db, request, ago(300 * DAY))
    await db.update(betaRequests).set({ closedAt: ago(10 * DAY) })
    await saveBetaRequest(db, { ...request, role: 'owner' }, now)
    const rows = await db.select().from(betaRequests)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ role: 'admin', createdAt: ago(300 * DAY), closedAt: ago(10 * DAY) })
  })

  it('keeps separate requests for separate servers', async () => {
    await saveBetaRequest(db, request, now)
    await saveBetaRequest(db, { ...request, server: 'Another server' }, now)
    expect(await db.select().from(betaRequests)).toHaveLength(2)
  })
})

describe('purging beta requests', () => {
  it('deletes requests closed over 30 days ago or made over a year ago, and keeps the rest', async () => {
    const rows = [
      { server: 'open, recent', createdAt: ago(10 * DAY), closedAt: null },
      { server: 'closed 29 days ago', createdAt: ago(100 * DAY), closedAt: ago(29 * DAY) },
      { server: 'closed 31 days ago', createdAt: ago(100 * DAY), closedAt: ago(31 * DAY) },
      { server: 'open, 364 days old', createdAt: ago(364 * DAY), closedAt: null },
      { server: 'open, 366 days old', createdAt: ago(366 * DAY), closedAt: null },
    ]
    await db.insert(betaRequests).values(rows.map(row => ({ ...request, ...row })))

    expect(await purgeBetaRequests(db, now)).toBe(2)
    const left = (await db.select().from(betaRequests)).map(row => row.server)
    expect(left).toEqual(['open, recent', 'closed 29 days ago', 'open, 364 days old'])
    expect(RETENTION).toEqual({ afterClose: 30 * DAY, maximum: 365 * DAY })
  })
})
