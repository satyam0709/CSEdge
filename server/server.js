import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import connectCloudinary from "./configs/cloudinary.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/app-educator-routes.js";
import courseRouter from "./routes/app-course-routes.js";
import userRouter from "./routes/app-user-routes.js";

const app = express();

// Connect DB + cloud
await connectDB();
await connectCloudinary();

const allowedOrigins = process.env.CLIENT_ORIGIN 
  ? process.env.CLIENT_ORIGIN.split(',')
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
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

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

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