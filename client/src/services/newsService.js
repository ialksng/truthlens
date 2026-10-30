import axios from "axios";

const NEWS_BASE_URL = "https://newsdata.io/api/1/latest";

export const fetchNewsByQuery = async (query = "technology") => {
  try {
    const res = await axios.get(
      `${NEWS_BASE_URL}?apikey=${import.meta.env.VITE_NEWSDATA_API_KEY}&q=${query}&language=en`
    );

    return res.data.results || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};