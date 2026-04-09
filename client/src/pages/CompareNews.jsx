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
      // FIXED: Using the correctly imported fetchNewsByQuery function
      const data = await fetchNewsByQuery(query);
      // FIXED: Assuming your service returns the array directly based on Home.jsx
      setSearchResults(data || []);
    } catch (err) {
      setError("Failed to fetch news. Try another search term.");
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSelection = (article) => {
    if (selectedArticles.find((a) => a.article_id === article.article_id)) {
      // Remove if already selected
      setSelectedArticles(selectedArticles.filter((a) => a.article_id !== article.article_id));
    } else {
      // Add if we have less than 2
      if (selectedArticles.length >= 2) {
        alert("You can only compare exactly 2 articles. Unselect one first.");
        return;
      }
      setSelectedArticles([...selectedArticles, article]);
    }
  };

  const handleCompare = async () => {
    if (!isLoggedIn()) {
      setError("You must be logged in to use the AI Comparison tool.");
      return;
    }
    if (selectedArticles.length !== 2) {
      setError("Please select exactly 2 articles to compare.");
      return;
    }

    setIsComparing(true);
    setError("");
    setComparisonResult(null);

    try {
      const result = await compareArticlesData(selectedArticles[0], selectedArticles[1]);
      setComparisonResult(result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to compare articles.");
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">Compare News Sources</h1>
        <p className="text-lg text-slate-400">Select two articles on the same topic to analyze bias and framing.</p>
      </div>

      {error && (
        <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-12">
        {/* LEFT COLUMN: Search & Select */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSearch} className="mb-6 flex gap-3">
            <input
              type="text"
              placeholder="Search a topic (e.g., Tesla, AI, Elections)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
            />
            <button type="submit" className="rounded-xl bg-cyan-500 px-6 font-bold text-slate-900 transition hover:bg-cyan-400">
              {isSearching ? "..." : "Search"}
            </button>
          </form>

          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {searchResults.map((article) => {
              const isSelected = selectedArticles.find((a) => a.article_id === article.article_id);
              return (
                <div 
                  key={article.article_id} 
                  onClick={() => toggleSelection(article)}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    isSelected ? "border-cyan-400 bg-cyan-500/10" : "border-slate-800 bg-slate-900 hover:border-slate-600"
                  }`}
                >
                  <p className="text-xs font-bold text-cyan-400 mb-1">{article.source_name || "Unknown Source"}</p>
                  <h3 className="text-md font-semibold text-white mb-2 line-clamp-2">{article.title}</h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-slate-500">{new Date(article.pubDate).toLocaleDateString()}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${isSelected ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-300'}`}>
                      {isSelected ? "Selected" : "Select"}
                    </span>
                  </div>
                </div>
              );
            })}
            {!isSearching && searchResults.length === 0 && (
              <p className="text-center text-slate-500 mt-10">Search for a topic to see articles.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Results & AI */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl min-h-[400px] flex flex-col">
            
            {/* Selected Articles Preview */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 border-b border-slate-800 pb-6">
              {[0, 1].map((index) => (
                <div key={index} className="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 p-4 relative">
                  {selectedArticles[index] ? (
                    <>
                      <span className="absolute -top-3 -left-3 bg-cyan-500 text-slate-900 w-8 h-8 flex items-center justify-center rounded-full font-bold">
                        {index + 1}
                      </span>
                      <p className="text-xs text-cyan-400 mb-2">{selectedArticles[index].source_name}</p>
                      <h4 className="text-sm font-semibold text-white line-clamp-3">{selectedArticles[index].title}</h4>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm py-6">
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center mb-2">{index + 1}</div>
                      Select an article
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex justify-center mb-8">
              <button 
                onClick={handleCompare}
                disabled={selectedArticles.length !== 2 || isComparing}
                className="rounded-xl bg-cyan-500 px-8 py-3 font-bold text-slate-900 transition hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isComparing ? "Analyzing Bias & Tone..." : "Analyze Differences"}
              </button>
            </div>

            {/* AI Comparison Results */}
            {isComparing && (
              <div className="flex flex-col items-center justify-center py-10 flex-1">
                 <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent mb-4"></div>
                 <p className="text-cyan-400">TruthLens AI is cross-referencing articles...</p>
              </div>
            )}

            {comparisonResult && !isComparing && (
              <div className="animate-fade-in space-y-6">
                <div className="rounded-xl bg-slate-800 p-5">
                  <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Overall Summary</h3>
                  <p className="text-slate-200 leading-relaxed">{comparisonResult.overallSummary}</p>
                </div>
                
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5">
                   <h3 className="text-sm font-bold text-amber-400 mb-2 uppercase tracking-wider">Factual Differences</h3>
                   <p className="text-amber-200/80 leading-relaxed">{comparisonResult.factualDifferences}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  {/* Article 1 Stats */}
                  <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-cyan-500 text-slate-900 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">1</span>
                      <h4 className="font-bold text-white truncate">{selectedArticles[0].source_name}</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-slate-400 block mb-1">Detected Bias</span>
                        <span className="inline-block bg-slate-700 text-cyan-300 px-3 py-1 rounded-lg text-sm font-medium">{comparisonResult.article1Analysis.bias}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block mb-1">Emotional Tone</span>
                        <span className="inline-block bg-slate-700 text-white px-3 py-1 rounded-lg text-sm font-medium">{comparisonResult.article1Analysis.tone}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block mb-1">Narrative Focus</span>
                        <p className="text-sm text-slate-300 leading-snug">{comparisonResult.article1Analysis.focus}</p>
                      </div>
                    </div>
                  </div>

                  {/* Article 2 Stats */}
                  <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-cyan-500 text-slate-900 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">2</span>
                      <h4 className="font-bold text-white truncate">{selectedArticles[1].source_name}</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-slate-400 block mb-1">Detected Bias</span>
                        <span className="inline-block bg-slate-700 text-cyan-300 px-3 py-1 rounded-lg text-sm font-medium">{comparisonResult.article2Analysis.bias}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block mb-1">Emotional Tone</span>
                        <span className="inline-block bg-slate-700 text-white px-3 py-1 rounded-lg text-sm font-medium">{comparisonResult.article2Analysis.tone}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block mb-1">Narrative Focus</span>
                        <p className="text-sm text-slate-300 leading-snug">{comparisonResult.article2Analysis.focus}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareNews;