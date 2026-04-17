import { Server } from "socket.io";
import { createSocketOriginCallback } from "../config/corsConfig.js";
import WeeklySprint from "../models/WeeklySprint.js";
import { buildSprintLeaderboard } from "../lib/weeklySprintLeaderboard.js";

let sprintIo = null;

async function getActiveSprintWithLeaderboard() {
  const now = new Date();
  const sprint = await WeeklySprint.findOne({
    isPublished: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
    .sort({ startDate: -1 })
    .lean();

  if (!sprint) return null;
  const data = await buildSprintLeaderboard({
    startDate: sprint.startDate,
    endDate: sprint.endDate,
    limit: 50,
    featuredCount: sprint.featuredCount || 5,
  });

  return {
    ...sprint,
    leaderboard: data.leaderboard,
    featured: data.featured,
    totalParticipants: data.totalParticipants,
  };
}

export function attachWeeklySprintSocket(httpServer, allowedOriginStrings) {
  const io = new Server(httpServer, {
    path: "/weekly-sprint-socket.io",
    cors: {
      origin: createSocketOriginCallback(allowedOriginStrings),
      credentials: false,
      methods: ["GET", "POST"],
    },
    allowEIO3: true,
  });

  io.on("connection", (socket) => {
    socket.on("sprint:subscribe-active", async () => {
      const sprint = await getActiveSprintWithLeaderboard();
      socket.emit("sprint:active-update", { sprint });
    });
  });

  sprintIo = io;
  return io;
}

export async function emitActiveSprintLeaderboardUpdate() {
  if (!sprintIo) return;
  const sprint = await getActiveSprintWithLeaderboard();
  sprintIo.emit("sprint:active-update", { sprint });
}
