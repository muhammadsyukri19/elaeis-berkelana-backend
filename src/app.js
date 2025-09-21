// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import desaRoutes from "./routes/desaRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) =>
  res.json({ status: "ok", name: "Elaeis Berkelana API" })
);
app.use("/desa", desaRoutes);
app.use("/media", mediaRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
