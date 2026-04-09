import { useLocation } from "react-router-dom";
import SummaryBox from "../components/SummaryBox";
import CredibilityBox from "../components/CredibilityBox";
import { saveBookmark } from "../services/bookmarkApi";
import { isLoggedIn } from "../services/authService";

const fallbackImage =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c";

function ArticleDetails() {
  const { state } = useLocation();
  const article = state?.article;

  if (!article) {
    return (
      <div className="p-10 text-center text-slate-400">
        No article selected.
      </div>
    );
  }

  const dummyAnalysis = {
    credibilityScore: 78,
    clickbaitLevel: "Medium",
    biasLevel: "Low",
    emotionalTone: "Neutral",
    explanation:
      "This article appears mostly factual and uses relatively balanced language. However, some claims should still be cross-checked with additional trusted sources.",
  };

  const dummySummary =
    "This article discusses a recent major development and highlights the key facts, reactions, and potential implications in a concise format.";

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
            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Read Original
            </a>

            <button
              onClick={handleSave}
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Save Article
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <SummaryBox summary={dummySummary} />
        <CredibilityBox analysis={dummyAnalysis} />
      </div>
    </div>
  );
}

export default ArticleDetails;