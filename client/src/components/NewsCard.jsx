import { Link } from "react-router-dom";

const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c";

function NewsCard({ article }) {
  return (
    <div className="glass group relative flex h-full flex-col overflow-hidden rounded-[2rem] transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/30 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.2)]">
      
      {/* 🚀 Cyberpunk Accent Line (Animates on hover) */}
      <div className="absolute left-0 top-0 z-20 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-700 group-hover:w-full" />

      {/* 🖼️ Image & Overlays */}
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-slate-950">
        <img
          src={article.image_url || fallbackImage}
          alt={article.title}
          onError={(e) => (e.target.src = fallbackImage)}
          className="h-full w-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-70"
        />
        {/* Techy Dark Gradient Fade */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(2,6,23,1)_100%)]" />
        {/* Subtle Cyan Tint on Hover */}
        <div className="absolute inset-0 mix-blend-overlay transition-colors duration-500 group-hover:bg-cyan-500/20" />
      </div>

      {/* 📝 Content Section (Flex to push button to bottom) */}
      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-2">
        
        {/* 🎛️ HUD Metadata Box */}
        <div className="absolute -top-8 left-6 right-6 flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
              {article.source_name || "INTEL SOURCE"}
            </span>
          </div>
          <span className="text-[10px] font-medium tracking-wider text-slate-400">
            {article.pubDate 
              ? new Date(article.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) 
              : "PENDING"}
          </span>
        </div>

        <h2 className="mb-3 mt-6 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-100">
          {article.title}
        </h2>

        <p className="mb-6 flex-1 line-clamp-3 text-sm leading-relaxed text-slate-400">
          {article.description || "Intelligence summary currently unavailable for this encrypted report."}
        </p>

        {/* ⚡ High-Tech Button */}
        <Link
          to="/article"
          state={{ article }}
          className="group/btn relative mt-auto flex w-full items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm font-bold text-white transition-all hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
          <span className="relative z-10 tracking-[0.1em] transition-all group-hover/btn:text-slate-950 group-hover/btn:tracking-[0.2em]">
            INITIATE ANALYSIS
          </span>
        </Link>
      </div>
    </div>
  );
}

export default NewsCard;