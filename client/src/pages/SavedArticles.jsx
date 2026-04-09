// client/src/pages/SavedArticles.jsx (Key additions)
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// 1. Make sure to import deleteBookmark
import { getBookmarks, deleteBookmark } from "../services/bookmarkApi"; 
import NewsCard from "../components/NewsCard";

function SavedArticles() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSavedArticles();
  }, []);

  const fetchSavedArticles = async () => {
    try {
      setLoading(true);
      const data = await getBookmarks();
      setBookmarks(data);
    } catch (err) {
      setError("Failed to load saved articles.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Add the handleRemove function
  const handleRemove = async (bookmarkId) => {
    // Optional: Add a confirmation dialog so they don't accidentally delete
    if (!window.confirm("Are you sure you want to remove this article?")) return;

    try {
      await deleteBookmark(bookmarkId);
      // 🔥 UI Polish: Filter the deleted article out of the state so it disappears instantly
      setBookmarks((prevBookmarks) => prevBookmarks.filter((b) => b._id !== bookmarkId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove article.");
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-cyan-400">Loading your library...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold text-white">Your Saved Library</h1>

      {error && <p className="text-red-400">{error}</p>}

      {!loading && bookmarks.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
          <p className="mb-4 text-slate-400">You haven't saved any articles yet.</p>
          <Link to="/" className="text-cyan-400 hover:underline">Go read some news</Link>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <div key={bookmark._id} className="relative group">
              
              {/* Render your existing NewsCard */}
              <NewsCard article={bookmark} /> 

              {/* 3. Add the Remove Button floating over the card */}
              <button
                onClick={() => handleRemove(bookmark._id)}
                className="absolute top-4 right-4 rounded-full bg-red-500/80 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-red-500 group-hover:opacity-100"
              >
                Remove
              </button>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedArticles;