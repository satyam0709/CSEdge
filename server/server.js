import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import connectDB from "./configs/mongodb.js";
import connectCloudinary from "./configs/cloudinary.js";

import adminRoutes from "./routes/app-admin-routes.js";
import courseRoutes from "./routes/app-course-routes.js";
import educatorRoutes from "./routes/app-educator-routes.js";
import testRoutes from "./routes/app-test-routes.js";
import userRoutes from "./routes/app-user-routes.js";
import companyArticleRoutes from "./routes/app-company-articles-routes.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";

const app = express();

// IMPORTANT: raw body for webhooks
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhooks);
app.post("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// Normal middleware AFTER webhooks
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

connectDB();
connectCloudinary();

// API ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/educator", educatorRoutes);
app.use("/api/test", testRoutes);
app.use("/api/user", userRoutes);
app.use("/api/company-articles", companyArticleRoutes);

app.get("/", (_, res) => res.send("LMS API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

export default app;
