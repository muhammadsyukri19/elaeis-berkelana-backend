// src/controllers/countryController.js
import Country from "../models/country.js";
import slugify from "slugify";

export const createCountry = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });
    const slug = slugify(name, { lower: true, strict: true });
    const exists = await Country.findOne({ $or: [{ name }, { slug }] });
    if (exists)
      return res.status(409).json({ message: "Country already exists" });

    const country = await Country.create({ name, slug });
    res.status(201).json(country);
  } catch (err) {
    next(err);
  }
};

export const listCountries = async (_req, res, next) => {
  try {
    const countryList = await Country.find().sort({ name: 1 });
    res.json(countryList);
  } catch (err) {
    next(err);
  }
};

export const updateCountry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updates = {};
    if (name) {
      updates.name = name;
      updates.slug = slugify(name, { lower: true, strict: true });
    }
    const updated = await Country.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Country not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCountry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const d = await Country.findByIdAndDelete(id);
    if (!d) return res.status(404).json({ message: "Country not found" });
    res.json({ message: "Country deleted" });
  } catch (err) {
    next(err);
  }
};
