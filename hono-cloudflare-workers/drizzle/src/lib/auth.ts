import { Lucia } from 'lucia'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { users, session } from '@/lib/db'

export const createLucia = (db, dev = false) => {
  const adapter = new DrizzleSQLiteAdapter(db, session, users)

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: !dev
      }
    },
    // getUserAttributes: (attributes) => {
    //   return {}
    // }
  })
}