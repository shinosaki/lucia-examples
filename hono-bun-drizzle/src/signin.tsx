import { setCookie } from 'hono/cookie'
import { compare } from 'bcryptjs'
import { getUsername } from '@/lib/db'
import { lucia } from '@/lib/auth'

export const get = (c) => {
  const user = c.get('user')
  const query = c.req.query()

  if (user) {
    return c.redirect('/')
  }

  return c.render(
    <>
      <h1>Sign in</h1>
      <form method="post" action="/signin">
        <label for="username">Username</label>
        <input name="username" id="username" /><br />

        <label for="password">Password</label>
        <input type="password" name="password" id="password" /><br />

        <button>Continue</button>
        <p>{query?.message ?? ""}</p>
      </form>

      <a href="/signup">Create an account</a>
    </>
  )
}

export const post = async (c) => {
  const { username, password } = c.req.valid('form')

  const user = await getUsername(username)
  if (!user || !await compare(password, user.password)) {
    return c.redirect('/?message=Incorrect username or password', 302)
  }

  const session = await lucia.createSession(user.id, {})
  const cookie = lucia.createSessionCookie(session.id)
  setCookie(c, cookie.name, cookie.value, {
    path: '.',
    ...cookie.attributes
  })

  return c.redirect('/', 302)
}