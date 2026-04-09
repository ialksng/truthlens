function CredibilityBox({ analysis }) {
  const score = Number(analysis?.credibilityScore ?? 78);
  const clickbait = analysis?.clickbaitLevel || "Medium";
  const bias = analysis?.biasLevel || "Low";
  const tone = analysis?.emotionalTone || "Neutral";
  const explanation =
    analysis?.explanation ||
    "This article appears reasonably credible, but some claims may require additional source verification. Language is mostly neutral with moderate headline sensationalism.";

  const getScoreColor = (score) => {
    if (score >= 75) return "text-emerald-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBarColor = (score) => {
    if (score >= 75) return "bg-emerald-400";
    if (score >= 50) return "bg-yellow-400";
    return "bg-red-400";
  };

  const getCredibilityLabel = (score) => {
    if (score >= 75) return "High Credibility";
    if (score >= 50) return "Moderate Credibility";
    return "Low Credibility";
  };

  const getBadgeStyle = (value, type) => {
    const lower = value.toLowerCase();

    if (type === "clickbait") {
      if (lower === "low") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/20";
      if (lower === "medium") return "bg-yellow-500/15 text-yellow-300 border-yellow-500/20";
      return "bg-red-500/15 text-red-300 border-red-500/20";
    }

    if (type === "bias") {
      if (lower === "low") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/20";
      if (lower === "medium") return "bg-yellow-500/15 text-yellow-300 border-yellow-500/20";
      return "bg-red-500/15 text-red-300 border-red-500/20";
    }

    if (type === "tone") {
      if (lower === "neutral") return "bg-cyan-500/15 text-cyan-300 border-cyan-500/20";
      if (lower === "optimistic") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/20";
      if (lower === "sensationalist") return "bg-orange-500/15 text-orange-300 border-orange-500/20";
      if (lower === "fear-mongering") return "bg-red-500/15 text-red-300 border-red-500/20";
      if (lower === "angry") return "bg-rose-500/15 text-rose-300 border-rose-500/20";
    }

    return "bg-slate-700 text-slate-200 border-slate-600";
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-cyan-400">
        Credibility Analysis
      </h2>

      {/* Credibility Score Highlight */}
      <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-950 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Credibility Score</p>
            <p className={`mt-2 text-4xl font-extrabold ${getScoreColor(score)}`}>
              {score}/100
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {getCredibilityLabel(score)}
            </p>
          </div>

          <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300">
            TruthLens AI
          </div>
        </div>

        <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full ${getScoreBarColor(score)} transition-all duration-500`}
            style={{ width: `${Math.min(score, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Clickbait Level</p>
          <div
            className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${getBadgeStyle(
              clickbait,
              "clickbait"
            )}`}
          >
            {clickbait}
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Bias Level</p>
          <div
            className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${getBadgeStyle(
              bias,
              "bias"
            )}`}
          >
            {bias}
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 sm:col-span-2">
          <p className="text-sm text-slate-400">Emotional Tone</p>
          <div
            className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${getBadgeStyle(
              tone,
              "tone"
            )}`}
          >
            {tone}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-5">
        <p className="text-sm font-medium text-slate-400">AI Explanation</p>
        <p className="mt-3 leading-7 text-slate-300">{explanation}</p>
      </div>
    </div>
  );
}

export default CredibilityBox;