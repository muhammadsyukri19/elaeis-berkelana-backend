// src/controllers/destinationController.js
import Destination from "../models/destination.js";
import Province from "../models/province.js";
import slugify from "slugify";

export const listDestinations = async (req, res, next) => {
  try {
    const {
      search = "",
      featured,
      provinceSlug,
      sort = "createdAt:-1",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};
    if (search) filter.$text = { $search: String(search) };
    if (featured) filter.featured = featured === "true";

    if (provinceSlug) {
      const provinceDoc = await Province.findOne({ slug: provinceSlug }).lean();
      if (provinceDoc) {
        filter.province = provinceDoc._id;
      } else {
        return res.json({ page: 1, total: 0, pages: 0, items: [] });
      }
    }

    const sortObj = {};
    String(sort)
      .split(",")
      .forEach((pair) => {
        const [field, dir] = pair.split(":");
        sortObj[field] = dir === "1" ? 1 : -1;
      });

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Destination.find(filter)
        .populate("country", "name slug")
        .populate("province", "name slug")
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Destination.countDocuments(filter),
    ]);

    res.json({
      page: Number(page),
      total,
      pages: Math.ceil(total / Number(limit)),
      items,
    });
  } catch (err) {
    next(err);
  }
};

export const getDestinationById = async (req, res, next) => {
  try {
    const doc = await Destination.findOne({ slug: req.params.id })
      .populate("country", "name slug")
      .populate("province", "name slug")
      .lean();
    if (!doc) return res.status(404).json({ message: "Destination not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const createDestination = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.title) {
      payload.slug = slugify(payload.title, { lower: true, strict: true });
    }
    const doc = await Destination.create(payload);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

export const updateDestination = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.title) {
      payload.slug = slugify(payload.title, { lower: true, strict: true });
    }
    const doc = await Destination.findOneAndUpdate(
      { slug: req.params.id },
      payload,
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Destination not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const deleteDestination = async (req, res, next) => {
  try {
    const doc = await Destination.findOneAndDelete({ slug: req.params.id });
    if (!doc) return res.status(404).json({ message: "Destination not found" });
    res.json({ message: "Destination deleted" });
  } catch (err) {
    next(err);
  }
};
