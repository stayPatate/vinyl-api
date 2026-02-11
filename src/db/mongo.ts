import mongoose from "mongoose"

export const connectDB = async () => {
  const {
    MONGO_CLUSTER,
    MONGO_DATABASE,
    MONGO_USER,
    MONGO_PWD
  } = process.env

  const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${MONGO_DATABASE}`

  await mongoose.connect(uri)

  console.log("Mongo connected")
}
