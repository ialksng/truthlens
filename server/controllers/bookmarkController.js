import Bookmark from "../models/Bookmark.js";

// Save bookmark
export const saveBookmark = async (req, res) => {
  try {
    const { title, description, url, urlToImage, source, publishedAt } = req.body;

    const existing = await Bookmark.findOne({
      userId: req.user,
      url,
    });

    if (existing) {
      return res.status(400).json({ message: "Article already bookmarked" });
    }

    const bookmark = await Bookmark.create({
      userId: req.user,
      title,
      description,
      url,
      urlToImage,
      source,
      publishedAt,
    });

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: "Failed to save bookmark" });
  }
};

// Get user bookmarks
export const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookmarks" });
  }
};