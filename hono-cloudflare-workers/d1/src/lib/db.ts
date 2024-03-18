export const getUsername = (db, username) =>
  db.prepare('SELECT * FROM users WHERE username=? LIMIT 1')
    .bind(username)
    .first()

export const existsUsername = (db, username) =>
  db.prepare('SELECT id FROM users WHERE username=? LIMIT 1')
    .bind(username)
    .first()
    .then(r => Boolean(r))

export const getUserId = (db, userId) =>
  db.prepare('SELECT * FROM users WHERE id=? LIMIT 1')
    .bind(userId)
    .first()

export const existsUserId = (db, userId) =>
  db.prepare('SELECT id FROM users WHERE id=? LIMIT 1')
    .bind(userId)
    .first()
    .then(r => Boolean(r))

export const createUser = (db, value) =>
  db.prepare('INSERT INTO users (id, username, password) VALUES(?, ?, ?)')
    .bind(value.id, value.username, value.password)
    .run()

export const getAllUser = (db) =>
  db.prepare('SELECT * FROM users')
    .all()

export const getAllSession = (db) =>
  db.prepare('SELECT * FROM session')
    .all()