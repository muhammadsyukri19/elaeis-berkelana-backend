// src/controllers/countryController.js
import Country from "../models/country.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const createCountry = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const slug = slugify(name, { lower: true, strict: true });
    const exists = await Country.findOne({ $or: [{ name }, { slug }] });
    if (exists)
      return res.status(409).json({ message: "Country already exists" });

    // Jika tidak ada file, buat negara tanpa gambar
    if (!req.file) {
      const country = await Country.create({ name, slug });
      return res.status(201).json(country);
    }

    // Jika ada file, proses upload ke Cloudinary
    const cloudFolder =
      process.env.CLOUDINARY_FOLDER || "elaeis-berkelana/countries";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${cloudFolder}/${slug}`,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Failed to upload image" });
        }

        const country = await Country.create({
          name,
          slug,
          image: {
            url: result.secure_url,
            publicId: result.public_id,
          },
        });

        res.status(201).json(country);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
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
    const { name, image } = req.body;
    const updates = {};
    if (name) {
      updates.name = name;
      updates.slug = slugify(name, { lower: true, strict: true });
    }
    if (image) updates.image = image;

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
    // Ganti findById dengan findOneAndDelete untuk mencari berdasarkan slug
    const d = await Country.findOneAndDelete({ slug: id });
    if (!d) return res.status(404).json({ message: "Country not found" });

    // Hapus gambar dari Cloudinary jika ada
    if (d.image?.publicId) {
      await cloudinary.uploader.destroy(d.image.publicId, {
        resource_type: "image",
      });
    }

    res.json({ message: "Country deleted" });
  } catch (err) {
    next(err);
  }
};
