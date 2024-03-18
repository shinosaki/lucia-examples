import { createStorage, prefixStorage } from 'unstorage'

export const storage = createStorage()
export const db = prefixStorage(storage, 'user')

export const getUser = (id) =>
  db.getItem(id)

export const existsUser = (id) =>
  db.hasItem(id)

export const createUser = (id, attributes) =>
  db.setItem(id, { id, attributes })

export const getAllStorage = async () =>
  storage.getItems(await storage.getKeys())