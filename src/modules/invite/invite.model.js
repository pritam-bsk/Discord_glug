import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    serverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Server",
      required: true,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
    },
    maxUses: {
      type: Number,
    },
    uses: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invite", inviteSchema);
