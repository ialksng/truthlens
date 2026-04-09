import { Link } from "react-router-dom";

const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c";

function NewsCard({ article }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_40px_-15px_rgba(6,182,212,0.3)]">
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src={article.image_url || fallbackImage}
          alt={article.title}
          onError={(e) => (e.target.src = fallbackImage)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative -mt-10 px-6 pb-6">
        {/* Floating Metadata */}
        <div className="backdrop-blur-md bg-slate-900/80 flex items-center justify-between rounded-2xl border border-white/5 p-3 mb-4 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            {article.source_name || "INTEL SOURCE"}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            {article.pubDate ? new Date(article.pubDate).toLocaleDateString() : "PENDING"}
          </span>
        </div>

        <h2 className="mb-3 line-clamp-2 text-xl font-bold tracking-tight text-white group-hover:text-cyan-100">
          {article.title}
        </h2>

        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-slate-400">
          {article.description || "Intelligence summary currently unavailable for this report."}
        </p>

        <Link
          to="/article"
          state={{ article }}
          className="flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:tracking-[0.1em]"
        >
          ANALYZE REPORT
        </Link>
      </div>
    </div>
  );
}

export default NewsCard;