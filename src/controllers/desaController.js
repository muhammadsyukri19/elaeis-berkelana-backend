// src/controllers/desaController.js
import Desa from "../models/desa.js";
import slugify from "slugify";

export const createDesa = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });
    const slug = slugify(name, { lower: true, strict: true });
    const exists = await Desa.findOne({ $or: [{ name }, { slug }] });
    if (exists) return res.status(409).json({ message: "Desa already exists" });

    const desa = await Desa.create({ name, slug });
    res.status(201).json(desa);
  } catch (err) {
    next(err);
  }
};

export const listDesa = async (_req, res, next) => {
  try {
    const desaList = await Desa.find().sort({ name: 1 });
    res.json(desaList);
  } catch (err) {
    next(err);
  }
};

export const updateDesa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updates = {};
    if (name) {
      updates.name = name;
      updates.slug = slugify(name, { lower: true, strict: true });
    }
    const updated = await Desa.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Desa not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteDesa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const d = await Desa.findByIdAndDelete(id);
    if (!d) return res.status(404).json({ message: "Desa not found" });
    res.json({ message: "Desa deleted" });
  } catch (err) {
    next(err);
  }
};
