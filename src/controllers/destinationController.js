import Destination from "../models/destination.js";
import slugify from "slugify";

export const listDestinations = async (req, res, next) => {
  try {
    const {
      search = "",
      featured,
      minPrice,
      maxPrice,
      country,
      province,
      sort = "createdAt:-1",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};
    if (search) filter.$text = { $search: String(search) };
    if (featured === "true") filter.featured = true;
    if (featured === "false") filter.featured = false;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (country) filter.country = country;
    if (province) filter.province = province;

    const sortObj = {};
    String(sort)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((pair) => {
        const [field, dirRaw] = pair.split(":");
        sortObj[field] = Number(dirRaw) === 1 ? 1 : -1;
      });

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Destination.find(filter)
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
    const doc = await Destination.findOne({ id: req.params.id }).lean();
    if (!doc) return res.status(404).json({ message: "Destination not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const createDestination = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (!payload.id && payload.title) {
      payload.id = slugify(payload.title, { lower: true, strict: true });
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
    if (!payload.id && payload.title) {
      payload.id = slugify(payload.title, { lower: true, strict: true });
    }
    const doc = await Destination.findOneAndUpdate(
      { id: req.params.id },
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
    const doc = await Destination.findOneAndDelete({ id: req.params.id });
    if (!doc) return res.status(404).json({ message: "Destination not found" });
    res.json({ message: "Destination deleted" });
  } catch (err) {
    next(err);
  }
};
