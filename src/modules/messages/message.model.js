import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true
    },
    deleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
)

messageSchema.index({ channelId: 1, createdAt: -1 });
export default mongoose.model("Message", messageSchema) 
