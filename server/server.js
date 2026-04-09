import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/projects/truthlens/api/auth", authRoutes);

app.use("/api/bookmarks", bookmarkRoutes);
app.use("/projects/truthlens/api/bookmarks", bookmarkRoutes);

app.get("/api", (req, res) => {
  res.send("TruthLens API is running...");
});

// --- Serve frontend build ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "../client/dist");

// Serve static files from the root
app.use("/projects/truthlens",express.static(clientBuildPath));

// React fallback: Catch all other routes and send index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});