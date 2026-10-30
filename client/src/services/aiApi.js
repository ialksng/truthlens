import api from "./api";
import { getToken } from "./authService";

export const analyzeArticleData = async (article) => {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to use AI Analysis.");
  }

  const payload = {
    title: article?.title || "Untitled Article",
    description: article?.description || article?.content || "No description available",
    source: article?.source_name || article?.source?.name || article?.source || "Unknown",
    link: article?.link || article?.url || ""
  };

  const res = await api.post("/ai/analyze", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const compareArticlesData = async (article1, article2) => {
  const token = getToken();
  if (!token) throw new Error("You must be logged in to use AI Comparison.");

  const payload = {
    article1: {
      title: article1.title,
      description: article1.description || article1.content,
      source: article1.source_name || article1.source?.name || "Unknown"
    },
    article2: {
      title: article2.title,
      description: article2.description || article2.content,
      source: article2.source_name || article2.source?.name || "Unknown"
    }
  };

  const res = await api.post("/ai/compare", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};