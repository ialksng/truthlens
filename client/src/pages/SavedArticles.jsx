import { useEffect, useState } from "react";
import { fetchBookmarks } from "../services/bookmarkApi";
import NewsCard from "../components/NewsCard";
import { isLoggedIn } from "../services/authService";

function SavedArticles() {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const data = await fetchBookmarks();
        setSavedArticles(data);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn()) {
      loadBookmarks();
    } else {
      setLoading(false);
    }
  }, []);

  if (!isLoggedIn()) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-4 text-4xl font-bold">Saved Articles</h1>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
          Please login to view saved articles.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-4 text-4xl font-bold">Saved Articles</h1>
      <p className="mb-8 text-slate-400">
        Your bookmarked and important reads will appear here.
      </p>

      {loading ? (
        <div className="text-slate-400">Loading saved articles...</div>
      ) : savedArticles.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
          No saved articles yet.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {savedArticles.map((article, index) => (
            <NewsCard
              key={index}
              article={{
                ...article,
                image_url: article.urlToImage,
                source_name: article.source,
                link: article.url,
                pubDate: article.publishedAt,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedArticles;