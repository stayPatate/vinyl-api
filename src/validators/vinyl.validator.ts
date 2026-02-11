import { z } from "zod"
import { VINYL_STATES } from "../models/vinyl.model.js"

const dateSchema = z.coerce.date().refine((d) => !Number.isNaN(d.getTime()), {
  message: "Invalid date",
})

export const vinylCreateSchema = z.object({
  title: z.string().trim().min(1),
  releaseDate: dateSchema,
  state: z.enum(VINYL_STATES),
  price: z.coerce.number().positive(),     // > 0
  stock: z.coerce.number().int().min(0),   // >= 0
  groupId: z.string().min(1),              // on checkera ObjectId côté routes (étape 7)
})

export const vinylUpdateSchema = vinylCreateSchema.partial()

export const vinylStockPatchSchema = z.object({
  delta: z.coerce.number().int(), // ex: -1 ou +5
})

export type VinylCreateInput = z.infer<typeof vinylCreateSchema>
export type VinylUpdateInput = z.infer<typeof vinylUpdateSchema>
export type VinylStockPatchInput = z.infer<typeof vinylStockPatchSchema>
