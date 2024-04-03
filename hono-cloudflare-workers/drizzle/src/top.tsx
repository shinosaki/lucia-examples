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
      <h1>Hi, {user.username}!</h1>
      <p>Your UserID: {user.id}</p>
      <form method="post" action="/signout">
        <button>Sign out</button>
      </form>
    </>
  )
}