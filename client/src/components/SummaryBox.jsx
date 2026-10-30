function SummaryBox({ summary }) {
  const content =
    typeof summary === "string" && summary.trim().length > 0
      ? summary
      : "Data pipeline empty. Run analysis to extract core concepts, narrative structures, and intelligence summaries.";

  return (
    <div className="group relative flex h-full flex-col rounded-[2rem] p-8 backdrop-blur-lg bg-white/5">
      {/* Accent Glow */}
      <div className="absolute -top-[1px] left-8 h-[2px] w-1/4 bg-gradient-to-r from-cyan-400 to-transparent transition-all duration-700 group-hover:w-1/2" />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-6">
        <h2 className="flex items-center gap-3 text-sm font-black tracking-[0.2em] text-cyan-400 uppercase">
          <svg className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Executive Summary
        </h2>

        <span className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-300">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
          VERIFIED
        </span>
      </div>

      {/* Summary Content */}
      <div className="flex-1 rounded-2xl border border-slate-700/50 bg-slate-950/50 p-6 shadow-inner">
        <p className="text-base font-light leading-loose text-slate-300 selection:bg-cyan-500/30">
          {content}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between opacity-50 transition-opacity hover:opacity-100">
        <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
          &gt; Processed by Neural Engine v2.4
        </p>
        <div className="h-1 w-1 animate-ping bg-cyan-500" />
      </div>
    </div>
  );
}

export default SummaryBox;