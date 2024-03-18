import { jsxRenderer } from 'hono/jsx-renderer'
import { getAllUser, getAllSession } from '@/lib/db'

export const layout = jsxRenderer(async ({ children }) => {
  const users = await getAllUser()
  const session = await getAllSession()

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
