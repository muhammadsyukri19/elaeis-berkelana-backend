// src/models/Desa.js
import mongoose from "mongoose";

const desaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true }
);

export default mongoose.model("Desa", desaSchema);
