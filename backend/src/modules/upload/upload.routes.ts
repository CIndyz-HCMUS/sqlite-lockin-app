// backend/src/modules/upload.routes.ts
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth } from "../../middleware/authMiddleware";


export const uploadRouter = Router();

// Cấu hình nơi lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = (req.params.type || "other") as string;
    const baseDir = path.join(__dirname, "..", "..", "uploads");

    let dir = baseDir;
    if (type === "foods") {
      dir = path.join(baseDir, "foods");
    } else if (type === "exercises") {
      dir = path.join(baseDir, "exercises");
    }

    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const safeName = file.originalname
      .replace(ext, "")
      .replace(/[^a-z0-9_-]/gi, "_")
      .toLowerCase();

    cb(null, `${timestamp}-${safeName}${ext}`);
  },
});

const upload = multer({ storage });

// POST /upload/foods  hoặc /upload/exercises
// gửi FormData với field name = "image"
uploadRouter.post(
  "/:type",
  requireAuth, // nếu muốn cho ai cũng upload được thì bỏ middleware này
  upload.single("image"),
  (req, res) => {
    const { type } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let folder = "";
    if (type === "foods") folder = "foods";
    else if (type === "exercises") folder = "exercises";

    const urlPath = folder
      ? `/uploads/${folder}/${req.file.filename}`
      : `/uploads/${req.file.filename}`;

    return res.status(201).json({
      message: "Uploaded",
      imageUrl: urlPath,
    });
  }
);
