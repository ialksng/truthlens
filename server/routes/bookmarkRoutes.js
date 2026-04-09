import express from "express";
import { saveBookmark, getBookmarks } from "../controllers/bookmarkController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, saveBookmark);
router.get("/", protect, getBookmarks);

export default router;