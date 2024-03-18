import { setCookie } from 'hono/cookie'
import { lucia } from '@/lib/auth'

export const post = async (c) => {
  const session = c.get('session')

  await lucia.invalidateSession(session.id)
  const cookie = lucia.createBlankSessionCookie()
  setCookie(c, cookie.name, cookie.value, {
    path: '.',
    ...cookie.attributes
  })

  return c.redirect('/signin', 302)
}