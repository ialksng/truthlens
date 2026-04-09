import api from "./api";
import { getToken } from "./authService";

export const saveBookmark = async (article) => {
  const token = getToken();

  const payload = {
    title: article.title,
    description: article.description,
    url: article.link || article.url,
    urlToImage: article.image_url || article.urlToImage,
    source: article.source_name || article.source?.name,
    publishedAt: article.pubDate || article.publishedAt,
  };

  const res = await api.post("/bookmarks", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const fetchBookmarks = async () => {
  const token = getToken();

  const res = await api.get("/bookmarks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteBookmark = async (bookmarkId) => {
  const token = localStorage.getItem("token"); // Or use your getToken() from authService
  
  if (!token) throw new Error("Authentication required");

  const res = await api.delete(`/bookmarks/${bookmarkId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};