import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { connectDB } from "./db/mongo.js"
import { groupRouter } from "./routes/group.routes.js"
import { vinylRouter } from "./routes/vinyl.routes.js"
import "dotenv/config"

const app = new Hono()

await connectDB()

app.route("/groups", groupRouter)
app.route("/vinyls", vinylRouter)

const port = Number(process.env.PORT ?? 3000)
app.get("/", (c) => c.json({ ok: true, message: "vinyl-api up" }))
serve({ fetch: app.fetch, port })
console.log(`Server running on http://localhost:${port}`)
