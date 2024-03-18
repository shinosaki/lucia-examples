import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { eq } from 'drizzle-orm'
import { users, session } from './schema'
export * from './schema'

const database = new Database('db.sqlite')
database.exec('PRAGMA journal_mode = WAL;')

export const db = drizzle(database)

export const getUsername = (username) =>
  db.select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1)
    .get()

export const existsUsername = async (username) =>
  Boolean(await getUsername(username))

export const getUserId = (userId) =>
  db.select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .get()

export const existsUserId = async (userId) =>
  Boolean(await getUserId(userId))

export const createUser = (value) =>
  db.insert(users)
    .values(value)

export const getAllUser = () =>
  db.select().from(users)

export const getAllSession = () =>
  db.select().from(session)
