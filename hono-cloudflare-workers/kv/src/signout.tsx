import { setCookie } from 'hono/cookie'

export const post = async (c) => {
  const session = c.get('session')
  const lucia = c.get('lucia')

  await lucia.invalidateSession(session.id)
  const cookie = lucia.createBlankSessionCookie()
  setCookie(c, cookie.name, cookie.value, {
    path: '.',
    ...cookie.attributes
  })

  return c.redirect('/signin', 302)
}