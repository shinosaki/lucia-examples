export const get = (c) => {
  const user = c.get('user')
  const query = c.req.query()

  if (!user) {
    return c.redirect(
      (query)
        ? `/signin?${new URLSearchParams(query).toString()}`
        : '/signin'
    )
  }

  return c.render(
    <>
      <h1>Hi, {user.id}!</h1>
      <form method="post" action="/signout">
        <button>Sign out</button>
      </form>
    </>
  )
}