// Database steps for beta sign-up requests, kept apart from the route and task so tests can run them
// against an in-memory SQLite database.
import { lt, or } from 'drizzle-orm'
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core'
import { betaRequests } from '../db/schema'
import type { BetaRequest } from './beta'
import { retentionCutoffs } from './beta'

type Database = BaseSQLiteDatabase<'async', unknown, Record<string, unknown>>

// Stores a request. If the same address has already asked for the same server, nothing changes: a
// resubmission must not reset the retention clock or reopen a request that was offered or declined.
export async function saveBetaRequest(db: Database, request: BetaRequest, now: Date): Promise<void> {
  await db.insert(betaRequests).values({ ...request, createdAt: now }).onConflictDoNothing()
}

// Deletes requests past their retention and returns how many went.
export async function purgeBetaRequests(db: Database, now: Date): Promise<number> {
  const { closedBefore, createdBefore } = retentionCutoffs(now)
  const deleted = await db.delete(betaRequests)
    .where(or(lt(betaRequests.closedAt, closedBefore), lt(betaRequests.createdAt, createdBefore)))
    .returning({ id: betaRequests.id })
  return deleted.length
}
