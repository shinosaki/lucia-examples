import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import { getAllUser, getAllSession } from '@/lib/db'

export const layout = jsxRenderer(async ({ children }) => {
  const c = useRequestContext()
  const db = c.get('db')

  const users = await getAllUser(db)
  const session = await getAllSession(db)

  return (
    <html>
      <body>
        <div>{children}</div>
        <hr />

        <h2>Database</h2>

        <h3>users</h3>
        <pre>{JSON.stringify(users, null, '  ')}</pre>
        <hr />

        <h3>session</h3>
        <pre>{JSON.stringify(session, null, '  ')}</pre>
        <hr />
      </body>
    </html>
  )
})
