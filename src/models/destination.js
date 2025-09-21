import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema(
  { day: { type: Number, min: 1, required: true }, activities: [String] },
  { _id: false }
);

const destinationSchema = new mongoose.Schema(
  {
    // id = slug unik yang dipakai FE (contoh: "bali-paradise")
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    duration: { type: String, required: true },
    included: [{ type: String }],
    itinerary: [itineraryItemSchema],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// bantu pencarian full-text
destinationSchema.index({
  title: "text",
  description: "text",
  location: "text",
});

export default mongoose.model("Destination", destinationSchema);
