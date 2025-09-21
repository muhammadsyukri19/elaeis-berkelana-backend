import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema(
  { day: { type: Number, min: 1, required: true }, activities: [String] },
  { _id: false }
);

const destinationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    // Tambahkan field negara dan provinsi
    country: { type: String, required: true },
    province: { type: String, required: true },
    village: { type: String }, // Menggunakan 'village' sesuai frontend
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

// Perbarui indeks pencarian untuk mencakup field baru
destinationSchema.index({
  title: "text",
  description: "text",
  country: "text",
  province: "text",
  village: "text",
});

export default mongoose.model("Destination", destinationSchema);
