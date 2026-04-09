import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import NewsCard from "../components/NewsCard";
import Loader from "../components/Loader";
import { fetchNewsByQuery } from "../services/newsService";

const categories = [
  "technology",
  "business",
  "sports",
  "health",
  "science",
  "entertainment",
  "politics",
];

function Home() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("technology");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("technology");
  const [error, setError] = useState("");

  const fetchNews = async (query = "technology") => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchNewsByQuery(query);

      if (!data.length) {
        setError("No articles found for this topic.");
      }

      setArticles(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching news.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIXED: auto-fetch when category changes
  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearchTerm(category);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      
      {/* 🚀 High-Tech Hero */}
      <section className="relative mb-16 overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900 px-8 py-16 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
        
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Neural Engine Online
            </span>
          </div>
          
          <h1 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-6xl font-black tracking-tighter text-transparent md:text-8xl">
            TruthLens
          </h1>
          
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            Decoding global news through AI. Detect bias, clickbait, and credibility instantly.
          </p>
        </div>
      </section>

      {/* 🔍 Search */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={() => fetchNews(searchTerm)}
      />

      {/* 🧠 Category HUD */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`group relative rounded-xl px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
              activeCategory === category
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                : "border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-cyan-500/50 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 📊 Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold capitalize">{activeCategory} News</h2>
        <p className="mt-2 text-slate-400">
          AI-analyzed headlines with credibility insights.
        </p>
      </div>

      {/* 📦 Content */}
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-300">
          {error}
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;