import multer from "multer";
import path from "path";

const storage = multer.diskStorage({});

function fileFilter(req, file, cb) {
  const mime = file.mimetype || "";
  const ext = path.extname(file.originalname || "").toLowerCase();
  const imageOk =
    mime.startsWith("image/") && [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext);
  const pdfOk = mime === "application/pdf" && ext === ".pdf";
  if (imageOk || pdfOk) {
    return cb(null, true);
  }
  cb(new Error("Only JPG, PNG, WebP, GIF images or PDF files are allowed."));
}

export const uploadStudyFile = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter,
});
