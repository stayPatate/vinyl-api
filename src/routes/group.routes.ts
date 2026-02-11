import { Hono } from "hono"
import mongoose from "mongoose"
import { GroupModel } from "../models/group.model.js"
import { groupCreateSchema, groupUpdateSchema } from "../validators/group.validator.js"

export const groupRouter = new Hono()

groupRouter.post("/", async (c) => {
  const body = await c.req.json().catch(() => null)
  const parsed = groupCreateSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)

  const created = await GroupModel.create(parsed.data)
  return c.json(created, 201)
})

groupRouter.get("/", async (c) => {
  const groups = await GroupModel.find().sort({ createdAt: -1 })
  return c.json(groups)
})

groupRouter.get("/:id", async (c) => {
  const id = c.req.param("id")
  if (!mongoose.isValidObjectId(id)) return c.json({ error: "Invalid id" }, 400)

  const group = await GroupModel.findById(id)
  if (!group) return c.json({ error: "Not found" }, 404)

  return c.json(group)
})

groupRouter.put("/:id", async (c) => {
  const id = c.req.param("id")
  if (!mongoose.isValidObjectId(id)) return c.json({ error: "Invalid id" }, 400)

  const body = await c.req.json().catch(() => null)
  const parsed = groupCreateSchema.safeParse(body) // PUT = complet
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)

  const updated = await GroupModel.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true })
  if (!updated) return c.json({ error: "Not found" }, 404)

  return c.json(updated)
})

groupRouter.patch("/:id", async (c) => {
  const id = c.req.param("id")
  if (!mongoose.isValidObjectId(id)) return c.json({ error: "Invalid id" }, 400)

  const body = await c.req.json().catch(() => null)
  const parsed = groupUpdateSchema.safeParse(body) // PATCH = partiel
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)

  const updated = await GroupModel.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true })
  if (!updated) return c.json({ error: "Not found" }, 404)

  return c.json(updated)
})

groupRouter.delete("/:id", async (c) => {
  const id = c.req.param("id")
  if (!mongoose.isValidObjectId(id)) return c.json({ error: "Invalid id" }, 400)

  const deleted = await GroupModel.findByIdAndDelete(id)
  if (!deleted) return c.json({ error: "Not found" }, 404)

  return c.json({ ok: true })
})
