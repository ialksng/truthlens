import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

// Eagerly connect when running as a standalone server
if (process.env.MONGO_URI) {
  connectDB().catch((err) => console.error("Initial DB connection warning:", err.message));
}

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "1mb" }));

// Ensure DB is connected before processing requests (critical for serverless environments)
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("DB connection error in request middleware:", err.message);
  }
  next();
});

const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/bookmarks", bookmarkRoutes);
apiRouter.use("/ai", aiRoutes);

apiRouter.get("/", (req, res) => {
  res.send("TruthLens API is running...");
});

// Support both standard, legacy subpath, and new production root subpaths
app.use("/work/projects/truthlens/app/api", apiRouter);
app.use("/projects/truthlens/api", apiRouter);
app.use("/api", apiRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientBuildPath));
app.use("/work/projects/truthlens/app", express.static(clientBuildPath));
app.use("/projects/truthlens", express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
