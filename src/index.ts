import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { connectDB } from './db/mongo.js'

const app = new Hono()

// connexion DB au démarrage
connectDB()

app.get('/', (c) => {
  return c.text('API Vinyl running')
})

const port = Number(process.env.PORT) || 3000

serve(
  {
    fetch: app.fetch,
    port
  },
  (info) => {
    console.log(`Server running on http://localhost:${info.port}`)
  }
)
