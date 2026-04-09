import { useState } from "react";
import { analyzeArticleData } from "../services/aiApi";
import { isLoggedIn } from "../services/authService";
import CredibilityBox from "../components/CredibilityBox";

function CompareNews() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [analysis1, setAnalysis1] = useState(null);
  const [analysis2, setAnalysis2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompare = async () => {
    if (!isLoggedIn()) {
      setError("Authentication required for cross-examination protocols.");
      return;
    }
    if (!url1 || !url2) {
      setError("Provide two valid target URLs to initiate comparison.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis1(null);
    setAnalysis2(null);

    try {
      // Run both AI analyses in parallel
      const [res1, res2] = await Promise.all([
        analyzeArticleData({ url: url1 }),
        analyzeArticleData({ url: url2 })
      ]);
      setAnalysis1(res1);
      setAnalysis2(res2);
    } catch (err) {
      setError("Neural engine failed to process one or both targets. Ensure URLs are accessible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      
      {/* 🛡️ Header */}
      <div className="mb-12 text-center border-b border-white/5 pb-12">
        <h1 className="mb-4 text-5xl font-black tracking-tighter text-white md:text-6xl">
          Cross <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-indigo-500">Examine</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-light text-slate-400">
          Input two contrasting sources to run a parallel credibility analysis.
        </p>
      </div>

      {/* 🔗 Input HUD */}
      <div className="glass mx-auto mb-16 max-w-4xl rounded-[2rem] p-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Target Alpha */}
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-cyan-400">Target Alpha URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={url1}
              onChange={(e) => setUrl1(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            />
          </div>
          {/* Target Beta */}
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-indigo-400">Target Beta URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={url2}
              onChange={(e) => setUrl2(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            />
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-sm font-medium text-red-400">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleCompare}
          disabled={loading}
          className="group relative mx-auto mt-8 flex w-full max-w-md items-center justify-center overflow-hidden rounded-xl border border-slate-600 bg-slate-800/50 px-8 py-4 text-sm font-bold tracking-[0.2em] text-white transition-all hover:border-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-3 text-cyan-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              PROCESSING MATRICES...
            </span>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10 group-hover:text-cyan-100">INITIATE COMPARISON</span>
            </>
          )}
        </button>
      </div>

      {/* 📊 Results Split Screen */}
      {(analysis1 || analysis2) && (
        <div className="relative grid gap-8 lg:grid-cols-2">
          
          {/* VS Badge (Absolute center on desktop) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 z-20 h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl">
            <span className="bg-gradient-to-br from-red-400 to-indigo-500 bg-clip-text text-xl font-black italic text-transparent">VS</span>
          </div>

          {/* Analysis 1 */}
          <div className="relative">
            <div className="mb-4 inline-block rounded-t-xl bg-cyan-500/10 px-6 py-2 border-b-2 border-cyan-500">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Target Alpha Scan</span>
            </div>
            {analysis1 ? <CredibilityBox analysis={analysis1} /> : <div className="glass h-full rounded-[2rem] flex items-center justify-center text-slate-500 p-10">Scan Failed / Empty</div>}
          </div>

          {/* Analysis 2 */}
          <div className="relative">
            <div className="mb-4 inline-block rounded-t-xl bg-indigo-500/10 px-6 py-2 border-b-2 border-indigo-500">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Target Beta Scan</span>
            </div>
            {analysis2 ? <CredibilityBox analysis={analysis2} /> : <div className="glass h-full rounded-[2rem] flex items-center justify-center text-slate-500 p-10">Scan Failed / Empty</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default CompareNews;