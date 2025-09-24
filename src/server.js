// src/server.js
import "dotenv/config"; // pastikan env kebaca paling awal
import { connectDB } from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

try {
  await connectDB(); // akan ambil MONGODB_URI / MONGO_URI dari .env
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("🛑 Failed to start server:", err?.message || err);
  process.exit(1);
}
