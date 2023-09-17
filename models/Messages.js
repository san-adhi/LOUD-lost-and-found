import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    loudId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loud",
      required: true,
    },
    connectUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const MessagesModel = mongoose.model("Messages", messageSchema);
