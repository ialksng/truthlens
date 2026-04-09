function SummaryBox({ summary }) {
  const content =
    summary ||
    "AI summary will appear here once analysis is available. This feature provides a concise breakdown of the article's main claims and context.";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-cyan-400">
          AI Summary
        </h2>

        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-300">
          TruthLens AI
        </span>
      </div>

      {/* Summary Content */}
      <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
        <p className="leading-8 text-slate-300 text-[15.5px]">
          {content}
        </p>
      </div>

      {/* Footer hint */}
      <p className="mt-4 text-xs text-slate-500">
        Generated using AI based on available article content.
      </p>
    </div>
  );
}

export default SummaryBox;