import { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";
import Loader from "../components/Loader";
import { getBookmarks } from "../services/bookmarkApi";
import { isLoggedIn } from "../services/authService";
import { Link } from "react-router-dom";

function SavedArticles() {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSaved = async () => {
      if (!isLoggedIn()) {
        setError("AUTHENTICATION REQUIRED. Please log in to access the encrypted vault.");
        setLoading(false);
        return;
      }

      try {
        const data = await getBookmarks();
        setSavedArticles(data);
      } catch (err) {
        console.error(err);
        setError("Failed to decrypt saved datapoints. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      
      {/* 🛡️ Header HUD */}
      <div className="mb-12 border-b border-white/5 pb-8">
        <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
            Secure Storage
          </span>
        </div>
        
        <h1 className="text-5xl font-black tracking-tight text-white md:text-6xl">
          Intel <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Vault</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-light text-slate-400">
          Your personal database of encrypted, verified datapoints and AI credibility reports.
        </p>
      </div>

      {/* 🗄️ Content Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : error ? (
        <div className="glass flex flex-col items-center justify-center rounded-[2rem] p-16 text-center">
          <div className="mb-6 h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-xl font-bold tracking-widest text-red-400 uppercase">{error}</p>
          {!isLoggedIn() && (
            <Link to="/login" className="mt-6 rounded-lg bg-cyan-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              INITIALIZE LOGIN
            </Link>
          )}
        </div>
      ) : savedArticles.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-[2rem] border-dashed border-white/10 p-20 text-center">
          <svg className="mb-6 h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-xl font-bold tracking-widest text-slate-400 uppercase">Vault is Empty</p>
          <p className="mt-2 text-sm text-slate-500">Scan and save articles from the Home dashboard or extension to populate your vault.</p>
          <Link to="/" className="mt-8 rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-6 py-2.5 text-xs font-bold tracking-widest text-cyan-400 transition-all hover:bg-cyan-500/20">
            BROWSE INTEL
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {savedArticles.map((article) => (
            <NewsCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedArticles;