import { createStorage, prefixStorage } from 'unstorage'
import cloudflareKVBindingDriver from 'unstorage/drivers/cloudflare-kv-binding'

export const createUnstorage = (KV) => {
  return createStorage({
    driver: cloudflareKVBindingDriver({
      binding: KV
    })
  })
}
export const createUserDB = (storage) => {
  return prefixStorage(storage, 'user')
}

export const getUser = (c, id) =>
  c.get('db').getItem(id)

export const existsUser = (c, id) =>
  c.get('db').hasItem(id)

export const createUser = (c, id, attributes) =>
  c.get('db').setItem(id, { id, attributes })

export const getAllStorage = async (c) =>
  c.get('storage').getItems(await c.get('storage').getKeys())