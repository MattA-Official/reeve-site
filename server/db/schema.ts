// Beta sign-up requests. Only what the pilot needs (see the privacy page): no IP address, no user agent.
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const betaRequests = sqliteTable('beta_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  server: text('server').notNull(),
  role: text('role', { enum: ['owner', 'admin', 'moderator'] }).notNull(),
  members: text('members', { enum: ['small', 'medium', 'large'] }).notNull(),
  email: text('email').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  // Set when a place is offered or the request is declined; the row is deleted 30 days later.
  closedAt: integer('closed_at', { mode: 'timestamp' }),
}, table => [
  // One request per server and email. Asking again changes nothing, so a resubmission can't extend retention.
  uniqueIndex('beta_requests_email_server').on(table.email, table.server),
])
