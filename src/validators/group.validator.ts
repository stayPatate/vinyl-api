import { z } from "zod"

export const groupCreateSchema = z.object({
  name: z.string().trim().min(1),
  genre: z.string().trim().min(1),
})

export const groupUpdateSchema = groupCreateSchema.partial()

export type GroupCreateInput = z.infer<typeof groupCreateSchema>
export type GroupUpdateInput = z.infer<typeof groupUpdateSchema>
