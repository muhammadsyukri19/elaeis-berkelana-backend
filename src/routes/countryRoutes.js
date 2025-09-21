// src/routes/countryRoutes.js
import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  createCountry,
  listCountries,
  updateCountry,
  deleteCountry,
} from "../controllers/countryController.js";

const router = Router();

// Public
router.get("/", listCountries);

// Admin
router.post("/", adminAuth, createCountry);
router.patch("/:id", adminAuth, updateCountry);
router.delete("/:id", adminAuth, deleteCountry);

export default router;
