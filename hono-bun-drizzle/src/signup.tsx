import { setCookie } from 'hono/cookie'
import { generateId } from 'lucia'
import { hash, genSalt } from 'bcryptjs'
import { createUser, existsUsername } from '@/lib/db'
import { lucia } from '@/lib/auth'

export const get = (c) => {
  const user = c.get('user')
  const query = c.req.query()

  if (user) {
    return c.redirect('/')
  }

  return c.render(
    <>
      <h1>Create an account</h1>
      <form method="post" action="/signup">
        <label for="username">Username</label>
        <input name="username" id="username" /><br />

        <label for="password">Password</label>
        <input type="password" name="password" id="password" /><br />

        <button>Continue</button>
        <p>{query?.message ?? ""}</p>
      </form>

      <a href="/signin">Sign in</a>
    </>
  )
}

export const post = async (c) => {
  const { username, password } = c.req.valid('form')

  if (await existsUsername(username)) {
    return c.redirect('/?message=Username already used', 302)
  }

  const data = {
    id: generateId(15),
    username,
    password: await hash(password, await genSalt())
  }
  await createUser(data)

  const session = await lucia.createSession(data.id, {})
  const cookie = lucia.createSessionCookie(session.id)
  setCookie(c, cookie.name, cookie.value, {
    path: '.',
    ...cookie.attributes
  })

  return c.redirect('/', 302)
}