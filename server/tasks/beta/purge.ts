// Deletes beta requests past their retention (server/utils/beta.ts). Runs daily; see nitro.scheduledTasks.
import { db } from 'hub:db'

export default defineTask({
  meta: { name: 'beta:purge', description: 'Delete beta sign-up requests past their retention' },
  async run() {
    // A count only: never the rows.
    return { result: { deleted: await purgeBetaRequests(db, new Date()) } }
  },
})
