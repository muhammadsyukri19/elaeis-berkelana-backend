// src/routes/index.js
import { Router } from "express";
import mediaRoutes from "./mediaRoutes.js";
import destinationRoutes from "./destinationRoutes.js";
import countryRoutes from "./countryRoutes.js";
import provinceRoutes from "./provinceRoutes.js";
import visitorRoutes from "./visitorRoutes.js";

const router = Router();
router.get("/health", (req, res) => res.json({ ok: true }));
router.use("/media", mediaRoutes);
router.use("/destinations", destinationRoutes);
router.use("/countries", countryRoutes);
router.use("/provinces", provinceRoutes);
router.use("/visitors", visitorRoutes);

export default router;
