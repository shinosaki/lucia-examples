import { Lucia } from 'lucia'
import { UnstorageAdapter } from 'lucia-adapter-unstorage'
import { dev } from '$app/environment'
import { storage } from '$lib/server/db'

const adapter = new UnstorageAdapter(storage)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev
    }
  },
  getUserAttributes: (attributes) => {
    return {
      fullname: attributes.fullname
    }
  }
})