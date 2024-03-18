import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import { getAllStorage } from '@/lib/db'

export const layout = jsxRenderer(async ({ children }) => {
  const items = await getAllStorage(useRequestContext())

  return (
    <html>
      <body>
        <div>{children}</div>
        <hr />
        <h2>Database</h2>
        <pre>{JSON.stringify(items, null, '  ')}</pre>
      </body>
    </html>
  )
})
