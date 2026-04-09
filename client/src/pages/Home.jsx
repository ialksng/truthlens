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

  useEffect(() => {
    fetchNews(activeCategory);
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearchTerm(category);
    fetchNews(category);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Hero */}
      <section className="mb-12 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl">
        <div className="max-w-3xl">
          <p className="mb-3 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
            AI-Powered News Intelligence
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            TruthLens
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Read smarter. Detect misinformation. Understand credibility, bias,
            and clickbait with AI-powered insights.
          </p>
        </div>
      </section>

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={() => fetchNews(searchTerm)}
      />

      {/* Categories */}
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition ${
              activeCategory === category
                ? "bg-cyan-500 text-slate-950"
                : "border border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold capitalize">{activeCategory} News</h2>
        <p className="mt-2 text-slate-400">
          Latest headlines with smart readability and AI-ready analysis.
        </p>
      </div>

      {/* Content */}
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