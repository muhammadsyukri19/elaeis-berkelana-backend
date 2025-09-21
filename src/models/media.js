// src/models/Media.js
import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    desa: { type: mongoose.Schema.Types.ObjectId, ref: "Desa", required: true },
    type: { type: String, enum: ["image", "youtube"], required: true },
    caption: { type: String, default: "" },
    tags: [{ type: String }],
    image: {
      url: String,
      publicId: String,
      width: Number,
      height: Number,
      format: String,
    },
    youtube: {
      videoId: String,
      originalUrl: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
