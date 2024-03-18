import { Lucia } from 'lucia'
import { UnstorageAdapter } from 'lucia-adapter-unstorage'

export const createLucia = (storage, dev = false) => {
  return new Lucia(new UnstorageAdapter(storage), {
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