import mongoose from "mongoose";

const loudSchema = mongoose.Schema(
  {
    loudType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
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

export const LoudsModel = mongoose.model("Louds", loudSchema);
