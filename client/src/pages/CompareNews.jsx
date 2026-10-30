import { useState } from "react";
import { fetchNewsByQuery } from "../services/newsService";
import { compareArticlesData } from "../services/aiApi";
import { isLoggedIn } from "../services/authService";

const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c";

function CompareNews() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState([]);
  
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError("");
    try {
      const data = await fetchNewsByQuery(query);
      setSearchResults(data || []);
    } catch (err) {
      setError("Failed to intercept intel. Try another search parameter.");
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSelection = (article) => {
    const articleId = article.article_id || article.url || article.link; // Fallback for safety
    
    if (selectedArticles.find((a) => (a.article_id || a.url || a.link) === articleId)) {
      setSelectedArticles(selectedArticles.filter((a) => (a.article_id || a.url || a.link) !== articleId));
    } else {
      if (selectedArticles.length >= 2) {
        alert("Maximum targets acquired. Deselect one target to swap.");
        return;
      }
      setSelectedArticles([...selectedArticles, article]);
    }
  };

  const handleCompare = async () => {
    if (!isLoggedIn()) {
      setError("Clearance denied. Authenticate to access Neural Comparison tool.");
      return;
    }
    if (selectedArticles.length !== 2) {
      setError("System requires exactly 2 targets to initiate cross-examination.");
      return;
    }

    setIsComparing(true);
    setError("");
    setComparisonResult(null);

    try {
      const result = await compareArticlesData(selectedArticles[0], selectedArticles[1]);
      setComparisonResult(result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Comparison sequence failed.");
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      
      {/* 🛡️ Header */}
      <div className="mb-12 border-b border-white/5 pb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
            Cross-Examination Protocol
          </span>
        </div>
        <h1 className="mb-4 text-5xl font-black tracking-tighter text-white md:text-6xl">
          Compare <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Intel</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-light text-slate-400">
          Query global networks, lock onto two contrasting targets, and initiate AI bias analysis.
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm font-bold tracking-widest text-red-400 uppercase">
          ⚠️ {error}
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-12">
        
        {/* 📡 LEFT COLUMN: Search & Select */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSearch} className="relative mb-8 flex items-center">
            <input
              type="text"
              placeholder="Query parameters (e.g. AI, Cybernetics, Politics)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-4 pl-6 pr-32 text-sm text-white placeholder-slate-500 outline-none backdrop-blur-md transition-all focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 bottom-2 rounded-xl bg-cyan-500 px-6 text-xs font-bold uppercase tracking-widest text-slate-950 transition hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] disabled:opacity-50"
              disabled={isSearching}
            >
              {isSearching ? "SCANNING" : "FETCH"}
            </button>
          </form>

          {/* Intel Feed */}
          <div className="glass flex flex-col gap-4 overflow-y-auto rounded-[2rem] p-4 max-h-[600px] border border-white/5">
            {searchResults.map((article) => {
              const articleId = article.article_id || article.url || article.link;
              const isSelected = selectedArticles.find((a) => (a.article_id || a.url || a.link) === articleId);
              
              return (
                <div 
                  key={articleId} 
                  onClick={() => toggleSelection(article)}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                    isSelected 
                      ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]" 
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800"
                  }`}
                >
                  {/* Selection Indicator Glow */}
                  {isSelected && <div className="absolute left-0 top-0 h-full w-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />}
                  
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500">
                    {article.source_name || "UNKNOWN SOURCE"}
                  </p>
                  <h3 className="mb-3 text-sm font-bold leading-snug text-white line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                      {article.pubDate ? new Date(article.pubDate).toLocaleDateString() : "TIMESTAMP UNAVAILABLE"}
                    </span>
                    <span className={`rounded-md px-3 py-1 text-[10px] font-bold tracking-widest uppercase transition-colors ${
                      isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                    }`}>
                      {isSelected ? "LOCKED IN" : "SELECT"}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {!isSearching && searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <svg className="mb-4 h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Awaiting search parameters</p>
              </div>
            )}
          </div>
        </div>

        {/* 💻 RIGHT COLUMN: Target Locks & AI Matrix */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="glass flex flex-1 flex-col rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
            
            {/* Target Preview Bay */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 border-b border-white/5 pb-8 relative z-10">
              {/* VS Divider for Desktop */}
              <div className="absolute left-1/2 top-1/2 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950 shadow-2xl sm:flex z-20">
                <span className="text-xs font-black italic text-cyan-400">VS</span>
              </div>

              {[0, 1].map((index) => {
                const isAlpha = index === 0;
                const themeColor = isAlpha ? "cyan" : "indigo";
                const article = selectedArticles[index];

                return (
                  <div key={index} className={`relative rounded-2xl border p-5 transition-all ${article ? `border-${themeColor}-500/30 bg-slate-900/80` : 'border-slate-800 border-dashed bg-slate-950/50'}`}>
                    {article ? (
                      <>
                        <div className={`absolute -top-3 -left-3 flex h-6 w-auto items-center justify-center rounded-md bg-${themeColor}-500 px-2 font-mono text-[10px] font-bold text-white uppercase tracking-widest shadow-[0_0_10px_rgba(var(--${themeColor}-glow),0.5)]`}>
                          TARGET {isAlpha ? 'ALPHA' : 'BETA'}
                        </div>
                        <p className={`mt-2 mb-2 text-[10px] font-black uppercase tracking-widest text-${themeColor}-400`}>
                          {article.source_name || "UNKNOWN"}
                        </p>
                        <h4 className="text-sm font-semibold text-white line-clamp-3 leading-snug">
                          {article.title}
                        </h4>
                      </>
                    ) : (
                      <div className="flex h-32 flex-col items-center justify-center text-center opacity-50">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-slate-500 font-mono text-xs text-slate-500">
                          {isAlpha ? 'A' : 'B'}
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Target slot empty</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Button */}
            {!comparisonResult && (
              <div className="my-auto flex justify-center relative z-10">
                <button 
                  onClick={handleCompare}
                  disabled={selectedArticles.length !== 2 || isComparing}
                  className="group/btn relative overflow-hidden rounded-xl border border-white/10 bg-slate-800 px-10 py-4 text-sm font-bold tracking-[0.2em] text-white transition-all hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isComparing ? (
                    <span className="flex items-center gap-3 text-cyan-400">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                      PROCESSING MATRICES...
                    </span>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-20" />
                      <span className="relative z-10 transition-all group-hover/btn:text-cyan-100">INITIATE AI COMPARISON</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* AI Results Output */}
            {comparisonResult && !isComparing && (
              <div className="animate-fade-in flex flex-col gap-6 relative z-10 mt-2">
                
                {/* Overall Summary Terminal */}
                <div className="rounded-2xl border border-slate-700/50 bg-slate-950 p-6 shadow-inner">
                  <h3 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    Executive Analysis
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-slate-200">
                    {comparisonResult.overallSummary}
                  </p>
                </div>
                
                {/* Factual Discrepancies Alert */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 backdrop-blur-sm">
                  <h3 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Identified Discrepancies
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-amber-200/80">
                    {comparisonResult.factualDifferences}
                  </p>
                </div>

                {/* Granular Stats Split */}
                <div className="grid gap-4 sm:grid-cols-2 mt-2">
                  
                  {/* Article 1 HUD */}
                  <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/50 p-6">
                    <h4 className="mb-5 border-b border-cyan-500/20 pb-3 text-xs font-bold text-cyan-400 uppercase tracking-widest truncate">
                      TGT-ALPHA: {selectedArticles[0].source_name}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Detected Bias</span>
                        <span className="inline-block rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-cyan-300">
                          {comparisonResult.article1Analysis.bias}
                        </span>
                      </div>
                      <div>
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Emotional Tone</span>
                        <span className="inline-block rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white">
                          {comparisonResult.article1Analysis.tone}
                        </span>
                      </div>
                      <div>
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Narrative Focus</span>
                        <p className="text-xs font-light leading-relaxed text-slate-300 italic">
                          "{comparisonResult.article1Analysis.focus}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Article 2 HUD */}
                  <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/50 p-6">
                    <h4 className="mb-5 border-b border-indigo-500/20 pb-3 text-xs font-bold text-indigo-400 uppercase tracking-widest truncate">
                      TGT-BETA: {selectedArticles[1].source_name}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Detected Bias</span>
                        <span className="inline-block rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-indigo-300">
                          {comparisonResult.article2Analysis.bias}
                        </span>
                      </div>
                      <div>
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Emotional Tone</span>
                        <span className="inline-block rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white">
                          {comparisonResult.article2Analysis.tone}
                        </span>
                      </div>
                      <div>
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Narrative Focus</span>
                        <p className="text-xs font-light leading-relaxed text-slate-300 italic">
                          "{comparisonResult.article2Analysis.focus}"
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                <button 
                  onClick={() => setComparisonResult(null)}
                  className="mt-4 mx-auto text-xs font-bold tracking-widest text-slate-500 uppercase hover:text-white transition"
                >
                  Reset Parameters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareNews;