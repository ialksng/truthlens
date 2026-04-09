import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SummaryBox from "../components/SummaryBox";
import CredibilityBox from "../components/CredibilityBox";
import { saveBookmark } from "../services/bookmarkApi";
import { isLoggedIn } from "../services/authService";
import { analyzeArticleData } from "../services/aiApi";

const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c";

function ArticleDetails() {
  const { state } = useLocation();
  const article = state?.article;

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!article) return;
      if (!isLoggedIn()) {
        setAiError("Please log in to view AI analysis.");
        return;
      }

      setLoadingAi(true);
      setAiError("");
      try {
        const result = await analyzeArticleData(article);
        setAiAnalysis(result);
      } catch (err) {
        setAiError(err.response?.data?.message || err.message || "Failed to analyze article.");
      } finally {
        setLoadingAi(false);
      }
    };

    fetchAnalysis();
  }, [article]);

  if (!article) {
    return <div className="p-10 text-center text-slate-400">No article selected.</div>;
  }

  const handleSave = async () => {
    if (!isLoggedIn()) {
      alert("Please login first to save articles.");
      return;
    }
    try {
      await saveBookmark(article);
      alert("Article saved to your account!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save article");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <img
          src={article.image_url || fallbackImage}
          alt={article.title}
          onError={(e) => (e.target.src = fallbackImage)}
          className="h-[400px] w-full object-cover"
        />
        <div className="p-8">
          <p className="mb-3 text-sm font-medium text-cyan-400">
            {article.source_name || "Unknown Source"}
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">{article.title}</h1>
          <p className="mb-6 text-slate-400">
            {article.pubDate ? new Date(article.pubDate).toLocaleString() : "Unknown publish date"}
          </p>
          <p className="text-lg leading-8 text-slate-300">
            {article.content || article.description || "No content available."}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href={article.link} target="_blank" rel="noreferrer" className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Read Original
            </a>
            <button onClick={handleSave} className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300">
              Save Article
            </button>
          </div>
        </div>
      </div>

      {/* AI Results Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {loadingAi ? (
          <div className="col-span-2 flex justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>
            <span className="ml-4 mt-2 text-cyan-400">TruthLens AI is analyzing this article...</span>
          </div>
        ) : aiError ? (
          <div className="col-span-2 rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-300">
            {aiError}
          </div>
        ) : aiAnalysis ? (
          <>
            <SummaryBox summary={aiAnalysis.summary} />
            <CredibilityBox analysis={aiAnalysis} />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ArticleDetails;