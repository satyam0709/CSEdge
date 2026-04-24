import { Server } from "socket.io";
import { verifyToken } from "@clerk/backend";
import { createSocketOriginCallback } from "../config/corsConfig.js";
import PlacementSheetProgress from "../models/PlacementSheetProgress.js";
import User from "../models/user.js";
import {
  buildPlacementSheetSnapshot,
  buildPlacementSheetLeaderboardRows,
} from "../lib/placementSheetProgress.js";

let placementSheetIo = null;

function roomName(userId) {
  return `placement-sheet:user:${String(userId)}`;
}
const LEADERBOARD_ROOM = "placement-sheet:leaderboard";

async function getSnapshotForUser(userId) {
  const doc = await PlacementSheetProgress.findOne({ userId: String(userId) }).lean();
  return buildPlacementSheetSnapshot(doc);
}

async function getLeaderboardSnapshot(limit = 20) {
  const docs = await PlacementSheetProgress.find({}).lean();
  const userIds = docs.map((d) => String(d.userId));
  const users = await User.find({ _id: { $in: userIds } }).select("_id name imageUrl").lean();
  const userMap = new Map(users.map((u) => [String(u._id), { name: u.name, imageUrl: u.imageUrl }]));
  return buildPlacementSheetLeaderboardRows(docs, userMap).slice(0, limit);
}

export function attachPlacementSheetSocket(httpServer, allowedOriginStrings) {
  const io = new Server(httpServer, {
    path: "/placement-sheet-socket.io",
    cors: {
      origin: createSocketOriginCallback(allowedOriginStrings),
      credentials: true,
      methods: ["GET", "POST"],
    },
    allowEIO3: true,
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token || typeof token !== "string") return next(new Error("auth_required"));
      const secretKey = process.env.CLERK_SECRET_KEY?.trim() || process.env.CLERK_SECRET?.trim();
      if (!secretKey) return next(new Error("server_misconfigured"));
      const payload = await verifyToken(token, { secretKey });
      const userId = payload?.sub;
      if (!userId) return next(new Error("unauthorized"));
      socket.data.userId = userId;
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("placement-sheet:subscribe", async () => {
      try {
        const userId = String(socket.data.userId || "");
        if (!userId) return;
        const room = roomName(userId);
        await socket.join(room);
        const snapshot = await getSnapshotForUser(userId);
        socket.emit("placement-sheet:update", snapshot);
      } catch (err) {
        socket.emit("placement-sheet:error", { message: err.message || "Failed to subscribe" });
      }
    });

    socket.on("placement-sheet:subscribe-leaderboard", async () => {
      try {
        await socket.join(LEADERBOARD_ROOM);
        const leaderboard = await getLeaderboardSnapshot(20);
        socket.emit("placement-sheet:leaderboard-update", { leaderboard });
      } catch (err) {
        socket.emit("placement-sheet:error", { message: err.message || "Failed to subscribe leaderboard" });
      }
    });
  });

  placementSheetIo = io;
  return io;
}

export async function emitPlacementSheetProgressUpdate(userId) {
  if (!placementSheetIo || !userId) return;
  const room = roomName(userId);
  const clients = await placementSheetIo.in(room).fetchSockets();
  if (!clients.length) return;
  const snapshot = await getSnapshotForUser(userId);
  placementSheetIo.to(room).emit("placement-sheet:update", snapshot);
}

export async function emitPlacementSheetLeaderboardUpdate() {
  if (!placementSheetIo) return;
  const clients = await placementSheetIo.in(LEADERBOARD_ROOM).fetchSockets();
  if (!clients.length) return;
  const leaderboard = await getLeaderboardSnapshot(20);
  placementSheetIo.to(LEADERBOARD_ROOM).emit("placement-sheet:leaderboard-update", { leaderboard });
}
