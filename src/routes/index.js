// src/routes/index.js
import { Router } from "express";
import desaRoutes from "./desaRoutes.js";
import mediaRoutes from "./mediaRoutes.js";
import destinationRoutes from "./destinationRoutes.js";

const router = Router();
router.get("/health", (req, res) => res.json({ ok: true }));
router.use("/desa", desaRoutes);
router.use("/media", mediaRoutes);
router.use("/destinations", destinationRoutes); // <—

export default router;
