import fs from "fs/promises";
import path from "path";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import fetch from "node-fetch";
import StudyMaterial from "../models/StudyMaterial.js";
import { normalizeDisplayName } from "../lib/userDisplayName.js";

const FOLDER = "lms-study-share";

function sanitizeFileName(name, fallback = "study-material") {
  const base = String(name || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || fallback;
}

function extensionFromMaterial(material) {
  if (material.fileType === "pdf") return ".pdf";
  const ext = path.extname(material.fileUrl || "").toLowerCase();
  if (ext && ext.length <= 8) return ext;
  return ".bin";
}

async function streamMaterial(req, res, mode = "inline") {
  const { id } = req.params;
  const material = await StudyMaterial.findById(id).lean();
  if (!material || !material.isVisible) {
    return res.status(404).json({ success: false, message: "Material not found." });
  }

  const upstream = await fetch(material.fileUrl);
  if (!upstream.ok || !upstream.body) {
    return res.status(502).json({ success: false, message: "Could not fetch file." });
  }

  const extension = extensionFromMaterial(material);
  const safeBase = sanitizeFileName(material.title, "study-material");
  const fileName = `${safeBase}${extension}`;
  const fallbackType =
    material.fileType === "pdf" ? "application/pdf" : "application/octet-stream";
  const contentType = upstream.headers.get("content-type") || fallbackType;

  res.setHeader("Content-Type", contentType);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "private, max-age=600");
  res.setHeader("Content-Disposition", `${mode}; filename="${fileName}"`);
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) res.setHeader("Content-Length", contentLength);

  upstream.body.on("error", (err) => {
    console.error("[study-share] stream", err);
    if (!res.headersSent) {
      res.status(500).end("Stream error.");
    } else {
      res.destroy(err);
    }
  });
  upstream.body.pipe(res);
  return undefined;
}

async function safeUnlink(filePath) {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch {
    /* ignore */
  }
}

async function getDisplayName(userId) {
  try {
    const user = await clerkClient.users.getUser(userId);
    const fn = user.firstName || "";
    const ln = user.lastName || "";
    const email = user.emailAddresses?.[0]?.emailAddress || "";
    return normalizeDisplayName({
      fullName: `${fn} ${ln}`,
      username: user.username,
      email,
      fallback: "Member",
    });
  } catch {
    /* ignore */
  }
  return "Member";
}

export const listStudyMaterials = async (req, res) => {
  try {
    const { examFocus } = req.query;
    const q = { isVisible: true };
    if (examFocus && examFocus !== "all") {
      q.examFocus = examFocus;
    }
    const items = await StudyMaterial.find(q)
      .sort({ createdAt: -1 })
      .limit(80)
      .lean();
    const uniqueUploaderIds = Array.from(
      new Set(items.map((m) => String(m.uploaderId || "")).filter(Boolean))
    );
    const displayNameMap = new Map();
    await Promise.all(
      uniqueUploaderIds.map(async (uid) => {
        const name = await getDisplayName(uid);
        displayNameMap.set(uid, name);
      })
    );

    res.json({
      success: true,
      materials: items.map((m) => ({
        _id: m._id,
        title: m.title,
        description: m.description,
        examFocus: m.examFocus,
        fileUrl: m.fileUrl,
        fileType: m.fileType,
        uploaderName: displayNameMap.get(String(m.uploaderId || "")) || m.uploaderName || "Member",
        uploaderId: m.uploaderId,
        createdAt: m.createdAt,
      })),
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const uploadStudyMaterial = async (req, res) => {
  const userId = req.auth()?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: "Attach an image or PDF file." });
  }

  let title = String(req.body.title || "").trim();
  const description = String(req.body.description || "").trim().slice(0, 2000);
  let examFocus = String(req.body.examFocus || "general").toLowerCase();
  const allowedFocus = [
    "placement",
    "gate",
    "cat",
    "banking",
    "ssc",
    "upsc",
    "jee",
    "neet",
    "general",
  ];
  if (!allowedFocus.includes(examFocus)) examFocus = "general";
  if (!title || title.length > 200) {
    await safeUnlink(file.path);
    return res.status(400).json({
      success: false,
      message: "Title is required (max 200 characters).",
    });
  }

  const isPdf = file.mimetype === "application/pdf";
  const fileType = isPdf ? "pdf" : "image";

  try {
    const uploadOpts = {
      folder: FOLDER,
      resource_type: isPdf ? "raw" : "image",
      use_filename: true,
      unique_filename: true,
    };

    const uploaded = await cloudinary.uploader.upload(file.path, uploadOpts);
    await safeUnlink(file.path);

    const uploaderName = await getDisplayName(userId);

    const doc = await StudyMaterial.create({
      title,
      description,
      examFocus,
      fileUrl: uploaded.secure_url,
      fileType,
      cloudinaryPublicId: uploaded.public_id,
      cloudinaryResourceType: isPdf ? "raw" : "image",
      uploaderId: userId,
      uploaderName,
    });

    return res.json({
      success: true,
      message: "Your notes are live for the community.",
      material: {
        _id: doc._id,
        title: doc.title,
        description: doc.description,
        examFocus: doc.examFocus,
        fileUrl: doc.fileUrl,
        fileType: doc.fileType,
        uploaderName: doc.uploaderName,
        uploaderId: doc.uploaderId,
        createdAt: doc.createdAt,
      },
    });
  } catch (e) {
    await safeUnlink(file.path);
    console.error("[study-share] upload", e);
    const msg = String(e?.message || "");
    const isCloudinarySizeLimit =
      e?.http_code === 400 &&
      msg.toLowerCase().includes("file size too large");

    if (isCloudinarySizeLimit) {
      return res.status(413).json({
        success: false,
        message: "File too large. Please upload a file up to 10 MB.",
      });
    }

    return res.status(500).json({
      success: false,
      message: e.message || "Upload failed. Try a smaller file or different format.",
    });
  }
};

export const deleteStudyMaterial = async (req, res) => {
  try {
    const userId = req.auth()?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const doc = await StudyMaterial.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    if (doc.uploaderId !== userId) {
      return res.status(403).json({ success: false, message: "You can only delete your own uploads." });
    }

    try {
      await cloudinary.uploader.destroy(doc.cloudinaryPublicId, {
        resource_type: doc.cloudinaryResourceType === "raw" ? "raw" : "image",
      });
    } catch (e) {
      console.warn("[study-share] cloudinary destroy", e.message);
    }

    await doc.deleteOne();
    res.json({ success: true, message: "Removed." });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const viewStudyMaterial = async (req, res) => {
  try {
    return await streamMaterial(req, res, "inline");
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

