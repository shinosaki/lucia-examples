import { lucia } from '$lib/server/auth'
import { verifyRequestOrigin } from 'lucia'
import { getCookie } from 'hono/cookie'

export const verifyOrigin = (c, next) => {
  const method = c.req.method
  const origin = c.req.header('Origin')
  const host = c.req.header('Host')

  // if (method === 'GET') return next()
  if (['GET', 'HEAD'].includes(method)) return next()

  return (!origin || !host || !verifyRequestOrigin(origin, [host]))
    ? c.body(null, 403)
    : next()
}

export const sessionValidator = async (c, next) => {
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null
  if (!sessionId) {
    c.set('user', null)
    c.set('session', null)
    return next()
  }

  const { session, user } = await lucia.validateSession(sessionId)
  const cookie = (session && session.fresh)
    ? lucia.createSessionCookie(session.id)
    : (!session) ? lucia.createBlankSessionCookie()
    : null

  if (cookie) {
    c.header("Set-Cookie", cookie.serialize(), { append: true })
  }

  c.set('user', user)
  c.set('session', session)
  return next()
}

export const Authentication = (c, next) => {
  if (!c.get('user')) {
    return c.body(null, 401)
  }
  return next()
}