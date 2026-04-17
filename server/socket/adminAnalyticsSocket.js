import { Server } from "socket.io";
import { verifyToken } from "@clerk/backend";
import { clerkClient } from "@clerk/express";
import { createSocketOriginCallback } from "../config/corsConfig.js";
import { getUserAnalyticsSnapshot } from "../lib/adminAnalytics.js";

let analyticsIo = null;

async function verifyEducatorToken(token) {
  const secretKey = process.env.CLERK_SECRET_KEY?.trim() || process.env.CLERK_SECRET?.trim();
  if (!secretKey) throw new Error("server_misconfigured");

  const payload = await verifyToken(token, { secretKey });
  const userId = payload?.sub;
  if (!userId) throw new Error("unauthorized");

  const user = await clerkClient.users.getUser(userId);
  if (user?.publicMetadata?.role !== "educator") throw new Error("forbidden");
  return userId;
}

export function attachAdminAnalyticsSocket(httpServer, allowedOriginStrings) {
  const io = new Server(httpServer, {
    path: "/admin-analytics-socket.io",
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
      const userId = await verifyEducatorToken(token);
      socket.data.userId = userId;
      next();
    } catch (error) {
      next(new Error(error.message || "unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("analytics:subscribe", async ({ userId, heatmapDays, readinessWindowDays } = {}) => {
      try {
        if (!userId) {
          socket.emit("analytics:error", { message: "userId is required" });
          return;
        }
        const room = `analytics:user:${String(userId)}`;
        await socket.join(room);

        const snapshot = await getUserAnalyticsSnapshot({
          userId: String(userId),
          heatmapDays,
          readinessWindowDays,
        });
        socket.emit("analytics:update", snapshot);
      } catch (error) {
        socket.emit("analytics:error", { message: error.message });
      }
    });

    socket.on("analytics:unsubscribe", async ({ userId } = {}) => {
      if (!userId) return;
      await socket.leave(`analytics:user:${String(userId)}`);
    });
  });

  analyticsIo = io;
  return io;
}

export async function emitUserAnalyticsUpdate(userId, options = {}) {
  if (!analyticsIo || !userId) return;
  const room = `analytics:user:${String(userId)}`;
  const clients = await analyticsIo.in(room).fetchSockets();
  if (!clients.length) return;

  const snapshot = await getUserAnalyticsSnapshot({
    userId: String(userId),
    heatmapDays: options.heatmapDays,
    readinessWindowDays: options.readinessWindowDays,
  });
  analyticsIo.to(room).emit("analytics:update", snapshot);
}
