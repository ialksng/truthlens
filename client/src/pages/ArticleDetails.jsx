import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SummaryBox from "../components/SummaryBox";
import CredibilityBox from "../components/CredibilityBox";
import { saveBookmark } from "../services/bookmarkApi";
import { isLoggedIn } from "../services/authService";
import { analyzeArticleData } from "../services/aiApi";

const fallbackImage =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c";

function ArticleDetails() {
  const { state } = useLocation();
  const article = state?.article;

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchAnalysis = async () => {
    if (!article) return;

    if (!isLoggedIn()) {
      setAiError("Please log in to unlock TruthLens AI analysis.");
      setAiAnalysis(null);
      return;
    }

    setLoadingAi(true);
    setAiError("");
    setAiAnalysis(null);

    try {
      const result = await analyzeArticleData(article);
      setAiAnalysis(result);
    } catch (err) {
      setAiError(
        err.response?.data?.message ||
          err.message ||
          "Failed to analyze article."
      );
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [article]);

  if (!article) {
    return (
      <div className="p-10 text-center text-slate-400">
        No article selected.
      </div>
    );
  }

  const handleSave = async () => {
    if (!isLoggedIn()) {
      alert("Please login first to save articles.");
      return;
    }

    try {
      setSaving(true);
      await saveBookmark(article);
      alert("Article saved to your account!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Article Card */}
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

          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
            {article.title}
          </h1>

          <p className="mb-6 text-slate-400">
            {article.pubDate
              ? new Date(article.pubDate).toLocaleString()
              : "Unknown publish date"}
          </p>

          <p className="text-lg leading-8 text-slate-300">
            {article.content || article.description || "No content available."}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {article.link && (
              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Read Original
              </a>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Article"}
            </button>
          </div>
        </div>
      </div>

      {/* AI Results Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {loadingAi ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>
            <span className="mt-4 text-cyan-400 font-medium">
              TruthLens AI is analyzing this article...
            </span>
            <p className="mt-2 text-sm text-slate-500">
              Checking summary, credibility, clickbait, and tone.
            </p>
          </div>
        ) : aiError ? (
          <div className="col-span-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-lg font-semibold text-red-300">AI Analysis Unavailable</p>
            <p className="mt-2 text-sm text-red-200/80">{aiError}</p>

            {isLoggedIn() && (
              <button
                onClick={fetchAnalysis}
                className="mt-5 rounded-xl bg-red-500/20 px-5 py-2 font-medium text-red-200 transition hover:bg-red-500/30"
              >
                Retry Analysis
              </button>
            )}
          </div>
        ) : aiAnalysis ? (
          <>
            {/* Warning if backend returned fallback */}
            {!aiAnalysis.aiAvailable && (
              <div className="col-span-2 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-yellow-200">
                <p className="font-semibold">Limited AI Response</p>
                <p className="mt-1 text-sm text-yellow-100/80">
                  TruthLens AI is temporarily rate-limited, so this is a fallback analysis.
                  Try again later for a richer AI breakdown.
                </p>
              </div>
            )}

            <SummaryBox summary={aiAnalysis.summary} />
            <CredibilityBox analysis={aiAnalysis} />
          </>
        ) : (
          <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            No AI analysis available yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleDetails;