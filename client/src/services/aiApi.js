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