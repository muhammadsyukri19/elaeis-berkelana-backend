// src/routes/provinceRoutes.js
import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  createProvince,
  listProvinces,
  updateProvince,
  deleteProvince,
} from "../controllers/provinceController.js";

const router = Router();

// Public
router.get("/", listProvinces); // GET /api/v1/provinces?countryId=...

// Admin
router.post("/", adminAuth, createProvince);
router.patch("/:id", adminAuth, updateProvince);
router.delete("/:id", adminAuth, deleteProvince);

export default router;
