import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { attachPresenceSocket } from "./socket/presenceSocket.js";
import { attachAdminAnalyticsSocket } from "./socket/adminAnalyticsSocket.js";
import { attachWeeklySprintSocket } from "./socket/weeklySprintSocket.js";
import {
  getAllowedOriginStrings,
  createExpressOriginCallback,
  expressPreflightCorsMiddleware,
  CORS_ALLOWED_HEADERS,
  CORS_ALLOWED_METHODS,
} from "./config/corsConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env"), quiet: true });

import connectDB from "./configs/mongodb.js";
import connectCloudinary from "./configs/cloudinary.js";

import adminRoutes from "./routes/app-admin-routes.js";
import courseRoutes from "./routes/app-course-routes.js";
import educatorRoutes from "./routes/app-educator-routes.js";
import testRoutes from "./routes/app-test-routes.js";
import userRoutes from "./routes/app-user-routes.js";
import companyArticleRoutes from "./routes/app-company-articles-routes.js";
import contestRoutes from "./routes/app-contest-routes.js";
import testimonialRoutes from "./routes/app-testimonial-routes.js";
import chatRoutes from "./routes/app-chat-routes.js";
import studyShareRoutes from "./routes/app-study-share-routes.js";
import mockInterviewRoutes from "./routes/app-mock-interview-routes.js";
import resumeRoutes from "./routes/app-resume-routes.js";
import sprintRoutes from "./routes/app-sprint-routes.js";
import mentorRoutes from "./routes/app-mentor-routes.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import { seedSqlQuestions } from "./controllers/adminController.js";

const app = express();

const allowedOrigins = getAllowedOriginStrings();

app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhooks);
app.post("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// Preflight first: guaranteed Allow-Headers including Authorization for allowed origins.
app.use(expressPreflightCorsMiddleware(allowedOrigins));

app.use(express.json());

// Match the SPA axios client (`withCredentials: false`) — Clerk uses Bearer tokens, not cookies.
// Explicit allowed headers so preflight always permits Clerk's `Authorization` bearer token.
// Relying on reflecting Access-Control-Request-Headers can fail behind some proxies or
// when the header list is missing/malformed, which yields:
// "Request header field authorization is not allowed by Access-Control-Allow-Headers".
app.use(
  cors({
    origin: createExpressOriginCallback(allowedOrigins),
    credentials: false,
    optionsSuccessStatus: 204,
    methods: CORS_ALLOWED_METHODS,
    allowedHeaders: [...CORS_ALLOWED_HEADERS],
  })
);

connectDB();
connectCloudinary();

app.use("/api/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/educator", educatorRoutes);
app.use("/api/test", testRoutes);
app.use("/api/user", userRoutes);
app.use("/api/company-articles", companyArticleRoutes);
app.use("/api/contest", contestRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/study-share", studyShareRoutes);
app.use("/api/mock-interview", mockInterviewRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/sprint", sprintRoutes);
app.use("/api/mentor", mentorRoutes);

app.get("/", (_, res) => res.send("LMS API Running"));

// ── Dev-only seed route (no Clerk auth — key protected) ──────────────────────
app.post("/api/seed/sql", (req, res, next) => {
  const key = req.headers["x-seed-key"] || req.query.key;
  if (!key || key !== (process.env.SEED_SECRET || "lms-seed-sql-2025")) {
    return res.status(403).json({ success: false, message: "Invalid seed key" });
  }
  return seedSqlQuestions(req, res, next);
});

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
attachPresenceSocket(httpServer, allowedOrigins);
attachAdminAnalyticsSocket(httpServer, allowedOrigins);
attachWeeklySprintSocket(httpServer, allowedOrigins);

httpServer.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} (HTTP + Socket.io presence)`);
});
export default app;