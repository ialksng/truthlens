import mongoose from "mongoose";

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    console.warn("⚠️ MONGO_URI is not defined in environment variables");
    return;
  }

  if (!cachedPromise) {
    const opts = {
      bufferCommands: false,
    };
    cachedPromise = mongoose.connect(process.env.MONGO_URI, opts).then((m) => {
      console.log("MongoDB connected successfully");
      return m;
    }).catch((error) => {
      cachedPromise = null;
      console.error("MongoDB connection failed:", error.message);
      throw error;
    });
  }

  return cachedPromise;
};

export default connectDB;
