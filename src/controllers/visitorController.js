// src/controllers/visitorController.js
import VisitorCount from "../models/visitorCount.js";

// Endpoint untuk mengambil jumlah pengunjung
export const getVisitorCount = async (_req, res, next) => {
  try {
    // Cari satu dokumen, atau buat jika belum ada
    const visitorData = await VisitorCount.findOneAndUpdate(
      {},
      { $setOnInsert: { count: 0 } },
      { new: true, upsert: true }
    );
    res.json({ count: visitorData.count });
  } catch (err) {
    next(err);
  }
};

// Endpoint untuk menambah jumlah pengunjung
export const incrementVisitorCount = async (_req, res, next) => {
  try {
    const visitorData = await VisitorCount.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    res.json({ count: visitorData.count });
  } catch (err) {
    next(err);
  }
};
