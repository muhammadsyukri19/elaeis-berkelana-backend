import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  listDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from "../controllers/destinationController.js";

const router = Router();

// Public
router.get("/", listDestinations); // GET /api/v1/destinations
router.get("/:id", getDestinationById); // GET /api/v1/destinations/bali-paradise

// Admin
router.post("/", adminAuth, createDestination);
router.patch("/:id", adminAuth, updateDestination);
router.delete("/:id", adminAuth, deleteDestination);

export default router;
