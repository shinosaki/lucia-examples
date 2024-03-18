import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { createLucia } from '@/lib/auth'
import { sessionValidator } from '@/lib/middleware'
import { drizzle } from 'drizzle-orm/d1'

import { layout } from './layout'
import * as top from './top'
import * as signup from './signup'
import * as signin from './signin'
import * as signout from './signout'

const app = new Hono()

app.use('*',
  (c, next) => {
    const db = drizzle(c.env.DB)
    c.set('db', db)
    c.set('lucia', createLucia(db, c.env.DEV))
    return next()
  },
  layout,
  csrf(),
  sessionValidator,
)

const schema = z.object({
  username: z.string().min(1).max(20),
  password: z.string().min(4),
})

app.post('/signup', zValidator('form', schema), signup.post)
app.post('/signin', zValidator('form', schema), signin.post)
app.post('/signout', signout.post)

app.get('/', top.get)
app.get('/signup', signup.get)
app.get('/signin', signin.get)

export default app
