import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import connectCloudinary from "./configs/cloudinary.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// Connect DB + cloud
await connectDB();
await connectCloudinary();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// Stripe webhook
app.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// Clerk webhook
app.post(
  "/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// ---------------------------------------------------------
// GLOBAL MIDDLEWARE (Applies to API routes below)
// ---------------------------------------------------------

// JSON body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk auth middleware
app.use(clerkMiddleware());

// API routes
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});