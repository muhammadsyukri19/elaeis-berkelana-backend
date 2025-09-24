// src/controllers/mediaController.js
import Media from "../models/media.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { extractYouTubeId } from "../utils/parseYoutube.js";

export const listMedia = async (req, res, next) => {
  try {
    const { desaId, type, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (desaId) filter.desa = desaId;
    if (type) filter.type = type;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Media.find(filter)
        .populate("desa", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Media.countDocuments(filter),
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

export const uploadImage = async (req, res, next) => {
  try {
    const { desaId, caption = "", tags = "" } = req.body;
    if (!desaId) return res.status(400).json({ message: "desaId is required" });
    const desa = await Desa.findById(desaId);
    if (!desa) return res.status(404).json({ message: "Desa not found" });
    if (!req.file)
      return res.status(400).json({ message: "No image file uploaded" });

    const cloudFolder =
      process.env.CLOUDINARY_FOLDER || "elaeis-berkelana/media";
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${cloudFolder}/${desa.slug}`,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
      },
      async (error, result) => {
        if (error) return next(error);

        const tagList = String(tags)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        const doc = await Media.create({
          desa: desa._id,
          type: "image",
          caption,
          tags: tagList,
          image: {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          },
        });

        res.status(201).json(doc);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    next(err);
  }
};

export const addYoutube = async (req, res, next) => {
  try {
    const { desaId, youtubeUrl, caption = "", tags = "" } = req.body;
    if (!desaId || !youtubeUrl) {
      return res
        .status(400)
        .json({ message: "desaId and youtubeUrl are required" });
    }
    const desa = await Desa.findById(desaId);
    if (!desa) return res.status(404).json({ message: "Desa not found" });

    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId)
      return res.status(400).json({ message: "Invalid YouTube URL" });

    const tagList = String(tags)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const doc = await Media.create({
      desa: desa._id,
      type: "youtube",
      caption,
      tags: tagList,
      youtube: { videoId, originalUrl: youtubeUrl },
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    if (media.type === "image" && media.image?.publicId) {
      await cloudinary.uploader.destroy(media.image.publicId, {
        resource_type: "image",
      });
    }
    await media.deleteOne();
    res.json({ message: "Media deleted" });
  } catch (err) {
    next(err);
  }
};
