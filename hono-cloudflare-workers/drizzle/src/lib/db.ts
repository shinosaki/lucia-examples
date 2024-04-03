import { eq } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  github_id: integer('github_id').unique(),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expiresAt: integer('expires_at').notNull(),
})

export const getUsername = (db, username) =>
  db.select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1)
    .get()

export const existsUsername = (db, username) =>
  getUsername(db, username)
    .then(r => Boolean(r))

export const getUserId = (db, userId) =>
  db.select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .get()

export const existsUserId = (db, userId) =>
  getUsername(db, userId)
    .then(r => Boolean(r))

export const createUser = (db, value) =>
  db.insert(users)
    .values(value)

export const getAllUser = (db) =>
  db.select().from(users)

export const getAllSession = (db) =>
  db.select().from(session)