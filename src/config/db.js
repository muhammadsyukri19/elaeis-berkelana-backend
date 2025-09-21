// src/config/db.js
import mongoose from "mongoose";

export async function connectDB(
  uri = process.env.MONGODB_URI || process.env.MONGO_URI
) {
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI (or MONGO_URI) in .env. Set it first."
    );
  }

  // Catat uri (disensor password) biar yakin env kebaca
  const redacted = uri.replace(/\/\/(.+?):(.+?)@/, "//$1:****@");
  console.log("ℹ️  Connecting MongoDB to:", redacted);

  // Opsi koneksi + timeout lebih panjang + force IPv4 (menghindari beberapa masalah DNS/IPv6)
  const options = {
    autoIndex: true,
    serverSelectionTimeoutMS: 15000,
    family: 4,
  };

  // (Opsional) retry sederhana 3x dengan backoff
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await mongoose.connect(uri, options);
      console.log("✅ MongoDB connected");
      return;
    } catch (err) {
      lastErr = err;
      console.error(
        `❌ MongoDB connect attempt ${attempt} failed:`,
        err?.message || err
      );
      // Kalau memang error SRV/DNS, kasih hint yang berguna
      if (
        /querySrv|ETIMEOUT|ENOTFOUND|getaddrinfo/i.test(String(err?.message))
      ) {
        console.error(
          "🔎 Hint: Cek IP whitelist di Atlas (0.0.0.0/0 untuk testing), koneksi internet/DNS, atau coba koneksi non-SRV (mongodb://...)."
        );
      }
      // backoff
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }

  // Kalau tetap gagal
  throw lastErr;
}
