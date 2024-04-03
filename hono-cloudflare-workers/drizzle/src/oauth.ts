import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { generateState, OAuth2RequestError } from 'arctic'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'
import { users } from '@/lib/db'

const app = new Hono()

app.get('/github', async (c) => {
  const { github } = c.get('oauth')
  if (!github) {
    return c.redirect('/?message=Github OAuth is not supported', 302)
  }

  const state = generateState()
  const url = await github.createAuthorizationURL(state)

  setCookie(c, 'github_oauth_state', state, {
    path: '/',
    secure: !c.env.DEV,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'Lax',
  })

  return c.redirect(url.href, 302)
})

app.get('/github/callback', async (c) => {
  const db = c.get('db')
  const lucia = c.get('lucia')
  const { github } = c.get('oauth')
  const { code, state } = c.req.query()
  const storedState = getCookie(c, 'github_oauth_state')

  if (!code || state !== storedState) {
    deleteCookie(c, 'github_oauth_state')
    return c.redirect('/?message=GitHub OAuth authentication failed. ', 302)
  }

  try {
    const token = await github.validateAuthorizationCode(code)
    const githubUser = await fetch('https://api.github.com/user', {
      headers: {
        'User-Agent': 'app',
        Authorization: `Bearer ${token.accessToken}`,
      }
    }).then(r => r.json())

    let user
    user = await db
      .select()
      .from(users)
      .where(eq(users.github_id, githubUser.id))
      .get()

    if (!user) {
      user = await db
        .insert(users)
        .values({
          id: generateId(15),
          github_id: githubUser.id,
          username: githubUser.login,
        })
        .returning()
        .get()
    }

    const session = await lucia.createSession(user.id, {})
    const cookie = lucia.createSessionCookie(session.id)
    setCookie(c, cookie.name, cookie.value, {
      path: '.',
      ...cookie.attributes
    })

    return c.redirect('/', 302)
  } catch(e) {
    console.log(e)
    const errorMessage = (e instanceof OAuth2RequestError)
      ? `Github Oauth Error: ${e.description ?? 'unknown error'}`
      : `Failed to sign in. server error`
    return c.redirect(`/?message=${errorMessage}`, 302)
  }
})

export default app