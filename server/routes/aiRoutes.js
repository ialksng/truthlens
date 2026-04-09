import express from "express";
import { analyzeArticle, compareArticles } from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", protect, analyzeArticle);
router.post("/compare", protect, compareArticles);

export default router;