import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
// import { Argon2id } from 'oslo/password'
import {
  verifyOrigin,
  sessionValidator,
  Authentication,
} from './lib/middleware'
import { lucia } from '$lib/server/auth'
import {
  getUser,
  existsUser,
  createUser,
} from '$lib/server/db'

const app = new Hono().basePath('/api')

app.use('*',
  verifyOrigin,
  sessionValidator,
  // Authentication
)

app.post('/signup', async (c) => {
  const { username, password } = await c.req.parseBody()

  if (await existsUser(username)) {
    return c.json({
      message: 'Username already used'
    }, 400)
  }

  await createUser(username, {
    // password: await new Argon2id().hash(password)
  })

  const session = await lucia.createSession(username, {})
  const cookie = lucia.createSessionCookie(session.id)
  setCookie(c, cookie.name, cookie.value, {
    path: '.',
    ...cookie.attributes
  })

  return c.redirect('/', 302)
})

app.post('/signin', async (c) => {
  const { username, password } = await c.req.parseBody()

  const user = await getUser(username)
  // if (!user || !await new Argon2id().verify(user.attributes.password, password)) {
  //   return c.json({
  //     message: 'Incorrect username or password'
  //   }, 400)
  // }

  const session = await lucia.createSession(user.id, {})
  const cookie = lucia.createSessionCookie(session.id)
  setCookie(c, cookie.name, cookie.value, {
    path: '.',
    ...cookie.attributes
  })

  return c.redirect('/', 302)
})

app.post('/signout', async (c) => {
  const session = c.get('session')

  await lucia.invalidateSession(session.id)
  const cookie = lucia.createBlankSessionCookie()
  setCookie(c, cookie.name, cookie.value, {
    path: '.',
    ...cookie.attributes
  })

  return c.redirect('/login', 302)
})

app.get('/', Authentication, (c) => {
  const user = c.get('user')
  const session = c.get('session')
  console.log(user, session)

  const url = new URL(c.req.url)
  return c.text(url.pathname)
})

export default app