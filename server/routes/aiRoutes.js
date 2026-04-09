import express from "express";
import { analyzeArticle } from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", protect, analyzeArticle);

export default router;