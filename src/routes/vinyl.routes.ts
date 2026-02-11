import { Hono } from "hono"
import mongoose from "mongoose"
import { VinylModel } from "../models/vinyl.model.js"
import { vinylCreateSchema, vinylUpdateSchema, vinylStockPatchSchema } from "../validators/vinyl.validator.js"

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
  const q = c.req.query()

  const { state, priceMin, groupId, genre, sort, fields, embed } = q

  const filter: any = {}

  if (state) filter.state = state
  if (priceMin) filter.price = { $gte: Number(priceMin) }

  if (groupId) {
    if (!mongoose.isValidObjectId(groupId)) return c.json({ error: "Invalid groupId" }, 400)
    filter.groupId = new mongoose.Types.ObjectId(groupId)
  }

  if (genre) {}

  let query = VinylModel.find(filter)

  const shouldEmbedGroup = embed === "group" || embed === "true"
  const shouldMatchGenre = Boolean(genre)

  if (shouldEmbedGroup || shouldMatchGenre) {
    query = query.populate({
      path: "groupId",
      select: shouldEmbedGroup ? undefined : "_id",
      match: shouldMatchGenre ? { genre } : undefined,
    })
  }

  if (sort) {
    const sortFields = sort.split(",").join(" ")
    query = query.sort(sortFields)
  } else {
    query = query.sort({ createdAt: -1 })
  }

  if (fields) {
    const selectFields = fields.split(",").join(" ")
    query = query.select(selectFields)
  }

  const vinyls = await query

  if (shouldMatchGenre) {
    return c.json(vinyls.filter((v: any) => v.groupId))
  }

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

vinylRouter.patch("/:id/stock", async (c) => {
  const id = c.req.param("id")
  if (!mongoose.isValidObjectId(id)) return c.json({ error: "Invalid id" }, 400)

  const body = await c.req.json().catch(() => null)
  const parsed = vinylStockPatchSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)

  const { delta } = parsed.data

  const updated = await VinylModel.findByIdAndUpdate(
    id,
    { $inc: { stock: delta } },
    { new: true }
  )

  if (!updated) return c.json({ error: "Not found" }, 404)

  // Optionnel: empêcher stock < 0 (simple)
  if (updated.stock < 0) {
    // rollback
    await VinylModel.findByIdAndUpdate(id, { $inc: { stock: -delta } })
    return c.json({ error: "Stock cannot be negative" }, 400)
  }

  return c.json(updated)
})

vinylRouter.delete("/:id", async (c) => {
  const id = c.req.param("id")
  if (!mongoose.isValidObjectId(id)) return c.json({ error: "Invalid id" }, 400)

  const deleted = await VinylModel.findByIdAndDelete(id)
  if (!deleted) return c.json({ error: "Not found" }, 404)

  return c.json({ ok: true })
})
