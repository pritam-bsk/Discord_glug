import mongoose from "mongoose"

const memberSchema = new mongoose.Schema(
  {
    serverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Server",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "MEMBER"],
      default: "MEMBER"
    }
  },
  { timestamps: true }
)

memberSchema.index({ serverId: 1, userId: 1 }, { unique: true })

export default mongoose.model("Member", memberSchema) 
