import { Server } from "socket.io";
import { verifyToken } from "@clerk/backend";
import User from "../models/user.js";
import { createSocketOriginCallback } from "../config/corsConfig.js";

function roomName(courseId) {
  return `course:${String(courseId)}`;
}

async function broadcastPresenceCount(io, courseId) {
  const room = roomName(courseId);
  const sockets = await io.in(room).fetchSockets();
  const userIds = new Set();
  for (const s of sockets) {
    if (s.data.userId) userIds.add(String(s.data.userId));
  }
  const studyingCount = userIds.size;
  const othersCount = Math.max(0, studyingCount - 1);
  io.to(room).emit("presence:update", {
    courseId: String(courseId),
    studyingCount,
    othersCount,
  });
}

async function leaveCurrentPresenceRoom(socket, io) {
  const cid = socket.data.presenceCourseId;
  if (!cid) return;
  socket.data.presenceCourseId = undefined;
  await socket.leave(roomName(cid));
  await broadcastPresenceCount(io, cid);
}

/**
 * Real-time "who's studying this course" — Socket.io rooms per courseId, unique users by Clerk id.
 * @param {import('http').Server} httpServer
 * @param {string[]} allowedOriginStrings same list as Express (from getAllowedOriginStrings)
 */
export function attachPresenceSocket(httpServer, allowedOriginStrings) {
  const io = new Server(httpServer, {
    path: "/socket.io",
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
      if (!token || typeof token !== "string") {
        return next(new Error("auth_required"));
      }
      const secretKey =
        process.env.CLERK_SECRET_KEY?.trim() || process.env.CLERK_SECRET?.trim();
      if (!secretKey) {
        console.warn(
          "[presence] Set CLERK_SECRET_KEY in server/.env for study-room WebSockets."
        );
        return next(new Error("server_misconfigured"));
      }
      const payload = await verifyToken(token, { secretKey });
      const sub = payload?.sub;
      if (!sub) return next(new Error("unauthorized"));
      socket.data.userId = sub;
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("presence:join", async ({ courseId } = {}) => {
      try {
        if (!courseId) return;
        const uid = socket.data.userId;
        const user = await User.findById(uid);
        const cid = String(courseId);
        const enrolled =
          user?.enrolledCourses?.some((id) => String(id) === cid) ?? false;
        if (!enrolled) {
          socket.emit("presence:error", {
            message: "Enroll in this course to join the virtual study room.",
          });
          return;
        }
        await leaveCurrentPresenceRoom(socket, io);
        await socket.join(roomName(cid));
        socket.data.presenceCourseId = cid;
        await broadcastPresenceCount(io, cid);
      } catch (err) {
        console.error("[presence] presence:join error:", err);
      }
    });

    socket.on("presence:leave", async () => {
      try {
        await leaveCurrentPresenceRoom(socket, io);
      } catch (err) {
        console.error("[presence] presence:leave error:", err);
      }
    });

    socket.on("disconnect", async () => {
      try {
        const cid = socket.data.presenceCourseId;
        if (cid) await broadcastPresenceCount(io, cid);
      } catch (err) {
        console.error("[presence] disconnect error:", err);
      }
    });
  });

  return io;
}
