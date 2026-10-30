import { useLocation } from "react-router-dom";
import { useState } from "react";
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
  const [saving, setSaving] = useState(false);

  if (!article) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-10 text-center">
        <div className="glass rounded-3xl p-10">
          <div className="mb-4 text-4xl">⚠️</div>
          <p className="text-lg font-bold tracking-widest text-slate-400">NO INTELLIGENCE SELECTED.</p>
        </div>
      </div>
    );
  }

  const articleKey = encodeURIComponent(article?.link || article?.title || "article");

  const fetchAnalysis = async () => {
    if (!isLoggedIn()) {
      setAiError("Authentication required to access Neural Engine.");
      setAiAnalysis(null);
      return;
    }

    const cached = localStorage.getItem(`analysis_${articleKey}`);
    if (cached) {
      setAiAnalysis(JSON.parse(cached));
      setAiError("");
      return;
    }

    setLoadingAi(true);
    setAiError("");
    setAiAnalysis(null);

    try {
      const result = await analyzeArticleData(article);
      setAiAnalysis(result);
      localStorage.setItem(`analysis_${articleKey}`, JSON.stringify(result));
    } catch (err) {
      setAiError(err.response?.data?.message || err.message || "Decryption failed.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSave = async () => {
    if (!isLoggedIn()) {
      alert("Please login first to save articles.");
      return;
    }
    try {
      setSaving(true);
      await saveBookmark(article);
      alert("Article saved to your encrypted vault!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      
      {/* 📰 Main Article HUD */}
      <div className="glass group relative mb-12 overflow-hidden rounded-[2.5rem]">
        {/* Animated Top Line */}
        <div className="absolute left-0 top-0 z-20 h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />

        <div className="relative h-[450px] w-full bg-slate-950">
          <img
            src={article.image_url || fallbackImage}
            alt={article.title}
            onError={(e) => (e.target.src = fallbackImage)}
            className="h-full w-full object-cover opacity-60 transition-transform duration-[20s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.05)_0%,transparent_100%)]" />
        </div>

        <div className="relative -mt-32 px-8 pb-10 sm:px-12">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-slate-900/80 px-4 py-2 backdrop-blur-md">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              {article.source_name || "UNKNOWN ORIGIN"}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            {article.title}
          </h1>

          <p className="mb-8 font-mono text-xs text-slate-400 uppercase tracking-widest">
            Logged: {article.pubDate ? new Date(article.pubDate).toLocaleString() : "TIMESTAMP UNAVAILABLE"}
          </p>

          <p className="max-w-4xl text-lg font-light leading-relaxed text-slate-300">
            {article.content || article.description || "No primary content available for this report."}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/5 pt-8">
            {article.link && (
              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="group/btn relative overflow-hidden rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-bold tracking-widest text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
              >
                OPEN SOURCE
              </a>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl border border-slate-600 bg-slate-800/30 px-8 py-3.5 text-sm font-bold tracking-widest text-slate-300 transition-all hover:border-white hover:bg-slate-800 hover:text-white disabled:opacity-50"
            >
              {saving ? "ENCRYPTING..." : "SAVE DATAPOINT"}
            </button>

            <button
              onClick={fetchAnalysis}
              disabled={loadingAi}
              className="group/btn ml-auto relative overflow-hidden rounded-xl border border-indigo-500/50 bg-indigo-500/10 px-8 py-3.5 text-sm font-bold tracking-[0.1em] text-indigo-300 transition-all hover:border-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-20" />
              <span className="relative z-10 transition-all group-hover/btn:tracking-[0.2em] group-hover/btn:text-white">
                {loadingAi ? "PROCESSING..." : "ACTIVATE AI ANALYSIS"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 🧠 AI Intelligence Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {loadingAi ? (
          <div className="col-span-2 glass flex flex-col items-center justify-center rounded-[2rem] py-20 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute h-full w-full animate-[spin_3s_linear_infinite] rounded-full border-2 border-dashed border-cyan-500" />
              <div className="h-2 w-2 animate-ping rounded-full bg-indigo-500" />
            </div>
            <h3 className="mt-8 text-xl font-bold tracking-[0.2em] text-cyan-400">NEURAL ENGINE ACTIVE</h3>
            <p className="mt-2 font-mono text-sm text-slate-500 uppercase">Extracting sentiment, verifying facts, calculating bias...</p>
          </div>
        ) : aiError ? (
          <div className="col-span-2 glass rounded-[2rem] border-red-500/30 bg-red-950/20 p-10 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <p className="text-xl font-bold tracking-widest text-red-400 uppercase">Analysis Disrupted</p>
            <p className="mt-2 text-sm text-red-300/70">{aiError}</p>
            {isLoggedIn() && (
              <button onClick={fetchAnalysis} className="mt-6 rounded-lg border border-red-500/50 bg-red-500/10 px-6 py-2 text-xs font-bold tracking-widest text-red-300 hover:bg-red-500/20">
                RETRY CONNECTION
              </button>
            )}
          </div>
        ) : aiAnalysis ? (
          <>
            {!aiAnalysis.aiAvailable && (
              <div className="col-span-2 glass rounded-2xl border-yellow-500/30 bg-yellow-500/10 p-5 backdrop-blur-md">
                <p className="font-bold tracking-widest text-yellow-400 uppercase text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
                  System Rate Limited
                </p>
                <p className="mt-1 text-xs text-yellow-200/70">
                  Full AI capabilities are temporarily throttled. Displaying fallback intelligence.
                </p>
              </div>
            )}
            <SummaryBox summary={aiAnalysis.summary} />
            <CredibilityBox analysis={aiAnalysis} />
          </>
        ) : (
          <div className="col-span-2 glass flex items-center justify-center rounded-[2rem] border-dashed border-white/10 p-16 text-center">
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              System is standing by. Click <span className="font-bold text-indigo-400">ACTIVATE AI ANALYSIS</span> to run this article through the TruthLens verification protocols.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleDetails;