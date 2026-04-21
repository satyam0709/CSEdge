import mongoose from "mongoose";

let hasBoundListeners = false;

const connectDB = async () => {
  if (!hasBoundListeners) {
    hasBoundListeners = true;
    mongoose.connection.on("connected", () => console.log("Database Connected"));
    mongoose.connection.on("error", (err) =>
      console.error("[mongodb] connection error:", err?.message || err)
    );
    mongoose.connection.on("disconnected", () =>
      console.warn("[mongodb] disconnected")
    );
  }

  const uriBase = String(process.env.MONGODB_URI || "").trim();
  if (!uriBase) {
    console.error("[mongodb] MONGODB_URI is missing in .env");
    return false;
  }

  const uri = `${uriBase.replace(/\/+$/, "")}/LMS`;
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    });
    return true;
  } catch (err) {
    console.error("[mongodb] initial connect failed:", err?.message || err);
    return false;
  }
};

export default connectDB;