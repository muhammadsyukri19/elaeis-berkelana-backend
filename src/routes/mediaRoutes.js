// src/routes/mediaRoutes.js
import { Router } from "express";
import multer from "multer";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  listMedia,
  uploadImage,
  addYoutube,
  deleteMedia,
} from "../controllers/mediaController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});
const router = Router();

// Public
router.get("/", listMedia); // gunakan ?desaId=... &type=image|youtube

// Admin
router.post("/image", adminAuth, upload.single("file"), uploadImage); // body: desaId
router.post("/youtube", adminAuth, addYoutube); // body: desaId, youtubeUrl
router.delete("/:id", adminAuth, deleteMedia);

export default router;
