function SummaryBox({ summary }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-cyan-400">AI Summary</h2>
      <p className="leading-8 text-slate-300">
        {summary || "AI summary will appear here once backend is connected."}
      </p>
    </div>
  );
}

export default SummaryBox;