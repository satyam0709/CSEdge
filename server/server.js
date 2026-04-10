import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { attachPresenceSocket } from "./socket/presenceSocket.js";
import {
  getAllowedOriginStrings,
  createExpressOriginCallback,
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
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";

const app = express();

app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhooks);
app.post("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

app.use(express.json());
const allowedOrigins = getAllowedOriginStrings();

app.use(
  cors({
    origin: createExpressOriginCallback(allowedOrigins),
    credentials: true,
    optionsSuccessStatus: 200,
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

app.get("/", (_, res) => res.send("LMS API Running"));

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
attachPresenceSocket(httpServer, allowedOrigins);

httpServer.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} (HTTP + Socket.io presence)`);
});
export default app;