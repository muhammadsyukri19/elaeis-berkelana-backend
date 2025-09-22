// src/routes/countryRoutes.js
import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import multer from "multer"; // Impor multer
import {
  createCountry,
  listCountries,
  updateCountry,
  deleteCountry,
} from "../controllers/countryController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});
const router = Router();

// Public
router.get("/", listCountries);

// Admin
router.post("/", adminAuth, upload.single("file"), createCountry); // Perbarui: Tambahkan middleware multer
router.patch("/:id", adminAuth, updateCountry);
router.delete("/:id", adminAuth, deleteCountry);

export default router;
