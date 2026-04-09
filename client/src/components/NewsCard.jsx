import { Link } from "react-router-dom";

const fallbackImage =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c";

function NewsCard({ article }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10">
      <img
        src={article.image_url || fallbackImage}
        alt={article.title}
        onError={(e) => (e.target.src = fallbackImage)}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-cyan-400">
            {article.source_name || "Unknown Source"}
          </p>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
            News
          </span>
        </div>

        <h2 className="mb-3 line-clamp-2 text-xl font-semibold leading-snug text-white">
          {article.title}
        </h2>

        <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-300">
          {article.description || "No description available."}
        </p>

        <div className="flex items-center justify-between">
          <Link
            to="/article"
            state={{ article }}
            className="rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            Read More
          </Link>

          <span className="text-xs text-slate-500">
            {article.pubDate
              ? new Date(article.pubDate).toLocaleDateString()
              : "Unknown date"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;