import PlacementSheetProgress from "../models/PlacementSheetProgress.js";
import User from "../models/user.js";
import {
  PLACEMENT_SHEET_META,
  buildPlacementSheetSnapshot,
  buildPlacementSheetLeaderboardRows,
} from "../lib/placementSheetProgress.js";
import {
  emitPlacementSheetProgressUpdate,
  emitPlacementSheetLeaderboardUpdate,
} from "../socket/placementSheetSocket.js";

async function findOrCreateProgress(userId) {
  let doc = await PlacementSheetProgress.findOne({ userId });
  if (!doc) {
    doc = await PlacementSheetProgress.create({ userId, sheets: {} });
  }
  return doc;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export async function getMyPlacementSheetProgress(req, res) {
  try {
    const userId = req.auth()?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const doc = await findOrCreateProgress(String(userId));
    return res.json({ success: true, progress: buildPlacementSheetSnapshot(doc) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateMyPlacementSheetProgress(req, res) {
  try {
    const userId = req.auth()?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const sheetKey = String(req.body.sheetKey || "");
    const meta = PLACEMENT_SHEET_META[sheetKey];
    if (!meta) {
      return res.status(400).json({ success: false, message: "Invalid sheet key" });
    }

    const hasAbsoluteValue = Number.isFinite(Number(req.body.completed));
    const deltaRaw = Number(req.body.delta);
    const delta = Number.isFinite(deltaRaw) ? Math.trunc(deltaRaw) : 0;
    const dailyTargetRaw = Number(req.body.dailyTarget);

    const doc = await findOrCreateProgress(String(userId));
    const current = Number(doc.sheets?.[sheetKey] ?? 0);

    let nextValue = current;
    if (hasAbsoluteValue) {
      nextValue = Math.trunc(Number(req.body.completed));
    } else {
      nextValue = current + delta;
    }
    nextValue = Math.min(meta.total, Math.max(0, nextValue));

    const changedBy = Math.max(0, nextValue - current);
    doc.sheets[sheetKey] = nextValue;

    if (Number.isFinite(dailyTargetRaw)) {
      doc.dailyTarget = Math.min(300, Math.max(1, Math.trunc(dailyTargetRaw)));
    }

    if (changedBy > 0) {
      const dayKey = todayIso();
      const existingToday = Number(doc.dailySolvedMap?.get(dayKey) || 0);
      doc.dailySolvedMap.set(dayKey, existingToday + changedBy);
      const day = String(dayKey);
      const list = Array.isArray(doc.activityDays) ? doc.activityDays : [];
      if (!list.includes(day)) {
        list.push(day);
        doc.activityDays = list.sort();
      }
    }

    await doc.save();

    await emitPlacementSheetProgressUpdate(String(userId));
    await emitPlacementSheetLeaderboardUpdate();

    return res.json({
      success: true,
      message: "Progress updated",
      progress: buildPlacementSheetSnapshot(doc),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateMyPlacementDailyTarget(req, res) {
  try {
    const userId = req.auth()?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const dailyTargetRaw = Number(req.body.dailyTarget);
    if (!Number.isFinite(dailyTargetRaw)) {
      return res.status(400).json({ success: false, message: "dailyTarget must be a number" });
    }
    const doc = await findOrCreateProgress(String(userId));
    doc.dailyTarget = Math.min(300, Math.max(1, Math.trunc(dailyTargetRaw)));
    await doc.save();
    await emitPlacementSheetProgressUpdate(String(userId));
    return res.json({ success: true, progress: buildPlacementSheetSnapshot(doc) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getGlobalPlacementSheetLeaderboard(_req, res) {
  try {
    const docs = await PlacementSheetProgress.find({}).lean();
    const userIds = docs.map((d) => String(d.userId));
    const users = await User.find({ _id: { $in: userIds } }).select("_id name email imageUrl").lean();
    const userMap = new Map(
      users.map((u) => [String(u._id), { name: u.name, email: u.email, imageUrl: u.imageUrl }])
    );
    const rows = buildPlacementSheetLeaderboardRows(docs, userMap).slice(0, 20);
    return res.json({ success: true, leaderboard: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
