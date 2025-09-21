// Middleware otentikasi admin sederhana pakai API Key
export const adminAuth = (req, res, next) => {
  try {
    // Ambil kunci admin dari request header
    const key = req.headers["x-admin-key"];

    // Bandingkan dengan ADMIN_KEY dari .env
    if (!key || key !== process.env.ADMIN_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: admin key invalid or missing",
      });
    }

    // Kalau valid, lanjut ke controller berikutnya
    next();
  } catch (err) {
    console.error("AdminAuth error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error (Auth)",
    });
  }
};
