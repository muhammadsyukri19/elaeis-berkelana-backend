// src/routes/visitorRoutes.js
import { Router } from "express";
import {
  getVisitorCount,
  incrementVisitorCount,
} from "../controllers/visitorController.js";

const router = Router();

// Endpoint untuk mendapatkan jumlah pengunjung
router.get("/", getVisitorCount);

// Endpoint untuk menambah jumlah pengunjung (biasanya POST/PATCH)
router.patch("/increment", incrementVisitorCount);

export default router;
