// src/models/country.js
import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: {
      url: String,
      publicId: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Country", countrySchema);
