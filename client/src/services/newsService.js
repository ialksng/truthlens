import axios from "axios";

const NEWS_BASE_URL = "https://newsdata.io/api/1/latest";

const FALLBACK_ARTICLES = [
  {
    article_id: "demo-1",
    title: "Breakthrough in Quantum Computing Achieves Room Temperature Superconductivity Simulation",
    description: "Researchers claim a new computational milestone using hybrid quantum-classical algorithms to model complex molecular interactions at ambient temperatures.",
    source_name: "TechPulse",
    pubDate: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    link: "https://example.com/quantum-breakthrough"
  },
  {
    article_id: "demo-2",
    title: "Global AI Regulatory Framework Ratified by 40 Nations to Combat Deepfakes and Misinformation",
    description: "International leaders sign a landmark pact establishing safety benchmarks and mandatory watermarking for synthetic digital media across global platforms.",
    source_name: "Global Tribune",
    pubDate: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    link: "https://example.com/ai-treaty"
  },
  {
    article_id: "demo-3",
    title: "SHOCKING TRUTH: You Won't Believe What Tech Giants Are Hiding In Your Daily Feed!",
    description: "Leaked documents allegedly reveal psychological profiling algorithms designed to maximize screen time through outrage amplification and sensationalized headlines.",
    source_name: "Daily Scoop",
    pubDate: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167",
    link: "https://example.com/shocking-truth-exposed"
  },
  {
    article_id: "demo-4",
    title: "Renewable Energy Grid Investments Surpass Fossil Fuel Infrastructure for Third Consecutive Year",
    description: "Economic transition data indicates private capital and sovereign funds directed record billions into high-capacity battery storage and geothermal projects.",
    source_name: "EconWatch",
    pubDate: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7",
    link: "https://example.com/renewable-grid"
  }
];

export const fetchNewsByQuery = async (query = "technology") => {
  const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ VITE_NEWSDATA_API_KEY is not set. Using curated demo articles. Add VITE_NEWSDATA_API_KEY in Vercel Environment Variables to fetch live news.");
    return FALLBACK_ARTICLES;
  }

  try {
    const res = await axios.get(
      `${NEWS_BASE_URL}?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=en`
    );

    return res.data.results && res.data.results.length > 0 
      ? res.data.results 
      : FALLBACK_ARTICLES;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("⚠️ NewsData API returned 401 Unauthorized (invalid or expired VITE_NEWSDATA_API_KEY). Using fallback articles.");
      return FALLBACK_ARTICLES;
    }
    console.error("Error fetching news:", error);
    return FALLBACK_ARTICLES;
  }
};
