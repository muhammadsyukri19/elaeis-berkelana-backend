// src/controllers/provinceController.js
import Province from "../models/province.js";
import slugify from "slugify";

export const createProvince = async (req, res, next) => {
  try {
    const { name, countryId } = req.body;
    if (!name || !countryId) {
      return res
        .status(400)
        .json({ message: "name and countryId are required" });
    }
    const slug = slugify(name, { lower: true, strict: true });
    const exists = await Province.findOne({ $or: [{ name }, { slug }] });
    if (exists)
      return res.status(409).json({ message: "Province already exists" });

    const province = await Province.create({ name, slug, country: countryId });
    res.status(201).json(province);
  } catch (err) {
    next(err);
  }
};

export const listProvinces = async (req, res, next) => {
  try {
    const { countryId } = req.query;
    const filter = {};
    if (countryId) filter.country = countryId;

    const provinceList = await Province.find(filter)
      .populate("country", "name slug")
      .sort({ name: 1 });
    res.json(provinceList);
  } catch (err) {
    next(err);
  }
};

export const updateProvince = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updates = {};
    if (name) {
      updates.name = name;
      updates.slug = slugify(name, { lower: true, strict: true });
    }
    const updated = await Province.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Province not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteProvince = async (req, res, next) => {
  try {
    const { id } = req.params;
    const d = await Province.findByIdAndDelete(id);
    if (!d) return res.status(404).json({ message: "Province not found" });
    res.json({ message: "Province deleted" });
  } catch (err) {
    next(err);
  }
};
