// src/routes/desaRoutes.js
import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { createDesa, listDesa,updateDesa, deleteDesa } from "../controllers/desacontroller.js";

const router = Router();

// Public
router.get("/", listDesa);

// Admin
router.post("/", adminAuth, createDesa);
router.patch("/:id", adminAuth, updateDesa);
router.delete("/:id", adminAuth, deleteDesa);

export default router;
