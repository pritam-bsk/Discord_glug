import mongoose from "mongoose"

const serverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
)

export default mongoose.model("Server", serverSchema) 
