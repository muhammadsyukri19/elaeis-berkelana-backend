// src/models/visitorCount.js
import mongoose from "mongoose";

const visitorCountSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("VisitorCount", visitorCountSchema);
