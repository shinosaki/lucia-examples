import { Lucia } from 'lucia'
import { D1Adapter } from '@lucia-auth/adapter-sqlite'

export const createLucia = (D1, dev = false) => {
  const adapter = new D1Adapter(D1, {
    user: 'users',
    session: 'session'
  })

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