import { Schema, model, type InferSchemaType, Types } from "mongoose"

export const VINYL_STATES = ["NEUF", "BON", "USE"] as const
export type VinylState = (typeof VINYL_STATES)[number]

const vinylSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    releaseDate: { type: Date, required: true },
    state: { type: String, required: true, enum: VINYL_STATES },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  },
  { timestamps: true }
)

// Optionnel: index utile pour les filtres
vinylSchema.index({ groupId: 1, state: 1, price: 1, releaseDate: 1 })

export type Vinyl = InferSchemaType<typeof vinylSchema> & { groupId: Types.ObjectId }
export const VinylModel = model("Vinyl", vinylSchema)
