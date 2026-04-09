import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import NewsCard from "../components/NewsCard";
import Loader from "../components/Loader";
import { fetchNewsByQuery } from "../services/newsService";

const categories = [
  "technology", "business", "sports", "health", 
  "science", "entertainment", "politics",
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
      if (!data.length) setError("No articles found for this topic.");
      setArticles(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearchTerm(category);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      
      {/* 🚀 Hero Section */}
      <section className="relative mb-16 overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/40 px-8 py-20 shadow-2xl backdrop-blur-xl sm:px-16">
        {/* Animated Background Orbs */}
        <div className="absolute -top-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-cyan-500/20 blur-[100px] duration-10000" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 animate-pulse rounded-full bg-indigo-500/20 blur-[100px] duration-10000 delay-1000" />
        
        <div className="relative z-10 mx-auto max-w-4xl text-center animate-float">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 backdrop-blur-md">
            <div className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              Neural Engine Online
            </span>
          </div>
          
          <h1 className="text-gradient mb-6 text-6xl font-black tracking-tighter md:text-8xl">
            Decode the <span className="text-gradient-cyan">Truth</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-slate-400 md:text-xl">
            Navigate global news through the lens of AI. Instantly detect bias, expose clickbait, and verify credibility.
          </p>
        </div>
      </section>

      {/* 🔍 Search */}
      <div className="mx-auto mb-12 max-w-2xl">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={() => fetchNews(searchTerm)}
        />
      </div>

      {/* 🎛️ Category HUD */}
      <div className="mb-16 flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`group relative rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              activeCategory === category
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-105"
                : "border border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 📰 Content Section */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black capitalize tracking-tight text-white">
            {activeCategory} Intelligence
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Real-time AI analysis of the latest headlines.
          </p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : error ? (
        <div className="glass rounded-2xl p-10 text-center text-red-400">
          <span className="text-2xl block mb-2">⚠️</span>
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