import express from "express";
import { saveBookmark, getBookmarks, removeBookmark } from "../controllers/bookmarkController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, saveBookmark);
router.get("/", protect, getBookmarks);
router.delete("/:id", protect, removeBookmark);

export default router;