// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) =>
  res.json({ status: "ok", name: "Elaeis Berkelana API" })
);
// Ganti baris ini dengan router utama yang sudah diperbarui
app.use("/api/v1", routes); // Menggunakan versi API untuk konsistensi

app.use(notFound);
app.use(errorHandler);

export default app;
