// src/routes/index.js
import { Router } from "express";
import desaRoutes from "./desaRoutes.js";
import mediaRoutes from "./mediaRoutes.js";
import destinationRoutes from "./destinationRoutes.js";
import countryRoutes from "./countryRoutes.js";
import provinceRoutes from "./provinceRoutes.js";

const router = Router();
router.get("/health", (req, res) => res.json({ ok: true }));
router.use("/desa", desaRoutes);
router.use("/media", mediaRoutes);
router.use("/destinations", destinationRoutes);
router.use("/countries", countryRoutes);
router.use("/provinces", provinceRoutes);

export default router;
