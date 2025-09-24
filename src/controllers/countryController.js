// src/controllers/countryController.js
import Country from "../models/country.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const createCountry = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Nama negara wajib diisi." });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const exists = await Country.findOne({ $or: [{ name }, { slug }] });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Negara dengan nama tersebut sudah ada.",
      });
    }

    // Jika tidak ada file, buat negara tanpa gambar
    if (!req.file) {
      const country = await Country.create({ name, slug });
      return res.status(201).json({ success: true, data: country });
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
          return res
            .status(500)
            .json({ success: false, message: "Gagal mengunggah gambar." });
        }

        try {
          const country = await Country.create({
            name,
            slug,
            image: {
              url: result.secure_url,
              publicId: result.public_id,
            },
          });
          res.status(201).json({ success: true, data: country });
        } catch (dbError) {
          next(dbError);
        }
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
    res.json({ success: true, data: countryList });
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
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Negara tidak ditemukan." });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteCountry = async (req, res, next) => {
  try {
    // Diubah untuk mencari berdasarkan slug, sesuai dengan kemungkinan penggunaan di frontend
    const { slug } = req.params;
    const d = await Country.findOneAndDelete({ slug: slug });
    if (!d) {
      return res
        .status(404)
        .json({ success: false, message: "Negara tidak ditemukan." });
    }

    // Hapus gambar dari Cloudinary jika ada
    if (d.image?.publicId) {
      await cloudinary.uploader.destroy(d.image.publicId, {
        resource_type: "image",
      });
    }

    res.json({ success: true, message: "Negara berhasil dihapus." });
  } catch (err) {
    next(err);
  }
};
