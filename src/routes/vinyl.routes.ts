import { Hono } from "hono"
import mongoose from "mongoose"
import { VinylModel } from "../models/vinyl.model.js"
import { vinylCreateSchema, vinylUpdateSchema } from "../validators/vinyl.validator.js"

export const vinylRouter = new Hono()

vinylRouter.post("/", async (c) => {
  const body = await c.req.json().catch(() => null)
  const parsed = vinylCreateSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)

  if (!mongoose.isValidObjectId(parsed.data.groupId)) {
    return c.json({ error: "Invalid groupId" }, 400)
  }

  const created = await VinylModel.create({
    ...parsed.data,
    groupId: new mongoose.Types.ObjectId(parsed.data.groupId),
  })

  return c.json(created, 201)
})

vinylRouter.get("/", async (c) => {
  const vinyls = await VinylModel.find().sort({ createdAt: -1 })
  return c.json(vinyls)
})

vinylRouter.get("/:id", async (c) => {
  const id = c.req.param("id")
  if (!mongoose.isValidObjectId(id)) return c.json({ error: "Invalid id" }, 400)

  const vinyl = await VinylModel.findById(id)
  if (!vinyl) return c.json({ error: "Not found" }, 404)

  return c.json(vinyl)
})

vinylRouter.put("/:id", async (c) => {
  const id = c.req.param("id")
  if (!mongoose.isValidObjectId(id)) return c.json({ error: "Invalid id" }, 400)

  const body = await c.req.json().catch(() => null)
  const parsed = vinylCreateSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)

  if (!mongoose.isValidObjectId(parsed.data.groupId)) {
    return c.json({ error: "Invalid groupId" }, 400)
  }

  const updated = await VinylModel.findByIdAndUpdate(
    id,
    { ...parsed.data, groupId: new mongoose.Types.ObjectId(parsed.data.groupId) },
    { new: true, runValidators: true }
  )
  if (!updated) return c.json({ error: "Not found" }, 404)

  return c.json(updated)
})

vinylRouter.patch("/:id", async (c) => {
  const id = c.req.param("id")
  if (!mongoose.isValidObjectId(id)) return c.json({ error: "Invalid id" }, 400)

  const body = await c.req.json().catch(() => null)
  const parsed = vinylUpdateSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)

  if (parsed.data.groupId && !mongoose.isValidObjectId(parsed.data.groupId)) {
    return c.json({ error: "Invalid groupId" }, 400)
  }

  const updateDoc: any = { ...parsed.data }
  if (parsed.data.groupId) updateDoc.groupId = new mongoose.Types.ObjectId(parsed.data.groupId)

  const updated = await VinylModel.findByIdAndUpdate(id, updateDoc, { new: true, runValidators: true })
  if (!updated) return c.json({ error: "Not found" }, 404)

  return c.json(updated)
})

vinylRouter.delete("/:id", async (c) => {
  const id = c.req.param("id")
  if (!mongoose.isValidObjectId(id)) return c.json({ error: "Invalid id" }, 400)

  const deleted = await VinylModel.findByIdAndDelete(id)
  if (!deleted) return c.json({ error: "Not found" }, 404)

  return c.json({ ok: true })
})
