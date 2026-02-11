import { Schema, model, type InferSchemaType } from "mongoose"

const groupSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
  },
  { timestamps: true } // ajoute createdAt + updatedAt
)

export type Group = InferSchemaType<typeof groupSchema>
export const GroupModel = model("Group", groupSchema)
