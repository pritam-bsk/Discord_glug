import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    serverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Server",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["TEXT", "VOICE"],
      default: "TEXT"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);
