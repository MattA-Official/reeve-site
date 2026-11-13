// Stores a beta sign-up request. Never logs the request or the address, and answers the same way whether
// or not the address has asked before, so it can't be used to find out who has signed up.
import { db } from 'hub:db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null)
  // A filled honeypot is a bot: answer as if it worked, so the trap isn't obvious, and store nothing.
  if (isHoneypotFilled(body)) {
    setResponseStatus(event, 201)
    return { ok: true }
  }

  const request = parseBetaRequest(body)
  if (!request) throw createError({ statusCode: 400, statusMessage: 'Bad request' })

  try {
    await saveBetaRequest(db, request, new Date())
  }
  catch {
    throw createError({ statusCode: 500, statusMessage: 'Could not save the request' })
  }

  setResponseStatus(event, 201)
  return { ok: true }
})
