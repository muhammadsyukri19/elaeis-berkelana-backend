import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema(
  {
    day: { type: Number, min: 1, required: true },
    activities: [String],
  },
  { _id: false }
);

const destinationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    province: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Province",
      required: true,
    },
    village: { type: String },
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

destinationSchema.index({
  title: "text",
  description: "text",
  village: "text",
});

export default mongoose.model("Destination", destinationSchema);
