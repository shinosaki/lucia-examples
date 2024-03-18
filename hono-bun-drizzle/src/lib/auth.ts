import { Lucia } from 'lucia'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { db, users, session } from '@/lib/db'

const adapter = new DrizzleSQLiteAdapter(db, session, users)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !process.env.NODE_ENV === 'production'
    }
  },
  // getUserAttributes: (attributes) => {
  //   return {}
  // }
})