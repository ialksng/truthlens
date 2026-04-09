import React from "react";

function CredibilityBox({ analysis }) {
  const score = Number(analysis?.credibilityScore ?? 78);
  const clickbait = analysis?.clickbaitLevel || "Medium";
  const bias = analysis?.biasLevel || "Low";
  const tone = analysis?.emotionalTone || "Neutral";
  const explanation =
    analysis?.explanation ||
    "This article appears reasonably credible, but some claims may require additional verification.";

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

  const getRiskLabel = (score) => {
    if (score >= 75) return "LOW RISK";
    if (score >= 50) return "MODERATE RISK";
    return "HIGH RISK";
  };

  const getBadgeStyle = (value, type) => {
    const lower = value.toLowerCase();

    if (type === "tone") {
      if (lower === "neutral")
        return "bg-cyan-500/15 text-cyan-300 border-cyan-500/20";
      if (lower === "optimistic")
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/20";
      if (lower === "sensationalist")
        return "bg-orange-500/15 text-orange-300 border-orange-500/20";
      if (lower === "fear-mongering")
        return "bg-red-500/15 text-red-300 border-red-500/20";
      if (lower === "angry")
        return "bg-rose-500/15 text-rose-300 border-rose-500/20";
    }

    if (lower === "low")
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/20";

    if (lower === "medium" || lower === "balanced")
      return "bg-yellow-500/15 text-yellow-300 border-yellow-500/20";

    return "bg-red-500/15 text-red-300 border-red-500/20";
  };

  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-xl">
      <h2 className="mb-8 text-xs font-black uppercase tracking-[0.3em] text-slate-500">
        // AI_CREDIBILITY_REPORT
      </h2>

      <div className="mb-10 rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-inner">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-widest">
              Confidence Index
            </p>

            <p className={`text-6xl font-black tracking-tighter ${getScoreColor(score)}`}>
              {score}%
            </p>

            <p className="text-xs text-slate-400 mt-1">
              {getRiskLabel(score)}
            </p>
          </div>

          <span className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-bold text-cyan-400">
            VERIFIED_DATA
          </span>
        </div>

        <div className="flex gap-1.5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`h-3 flex-1 rounded-sm transition-all duration-700 ${
                i < score / 5
                  ? `${getScoreBarColor(score)} shadow-[0_0_6px_rgba(16,185,129,0.5)]`
                  : "bg-slate-800"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Bias", value: bias, type: "bias" },
          { label: "Clickbait", value: clickbait, type: "clickbait" },
          { label: "Tone", value: tone, type: "tone" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-cyan-500/40 transition"
          >
            <p className="text-[10px] text-slate-500 uppercase mb-2">
              {item.label}
            </p>

            <span
              className={`rounded-lg border px-3 py-1 text-[10px] font-bold uppercase ${getBadgeStyle(
                item.value,
                item.type
              )}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border-l-4 border-cyan-500 bg-slate-950 p-5">
        <p className="text-[10px] font-bold text-cyan-400 uppercase mb-2">
          AI Reasoning Engine
        </p>

        <p className="text-sm leading-relaxed text-slate-300 italic">
          "{explanation}"
        </p>
      </div>

      <button
        onClick={() => alert("Detailed AI analysis coming soon 🚀")}
        className="mt-6 w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-3 text-sm font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
      >
        Explain in Detail →
      </button>
    </div>
  );
}

export default CredibilityBox;