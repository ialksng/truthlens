import React from "react";

function CredibilityBox({ analysis }) {
  const score = Number(analysis?.credibilityScore ?? 78);
  const clickbait = analysis?.clickbaitLevel || "Medium";
  const bias = analysis?.biasLevel || "Low";
  const tone = analysis?.emotionalTone || "Neutral";
  const explanation =
    analysis?.explanation ||
    "Initial scans indicate reasonable baseline credibility. Secondary verification of independent sources is recommended.";

  const getScoreColor = (score) => {
    if (score >= 75) return "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]";
    if (score >= 50) return "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]";
    return "text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.3)]";
  };

  const getScoreBarColor = (score) => {
    if (score >= 75) return "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]";
    if (score >= 50) return "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]";
    return "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]";
  };

  const getRiskLabel = (score) => {
    if (score >= 75) return "LOW RISK / VERIFIED";
    if (score >= 50) return "MODERATE RISK / CAUTION";
    return "HIGH RISK / UNVERIFIED";
  };

  const getBadgeStyle = (value, type) => {
    const lower = value.toLowerCase();
    if (type === "tone") {
      if (lower === "neutral") return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
      if (lower === "optimistic") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      if (lower === "sensationalist") return "bg-orange-500/15 text-orange-300 border-orange-500/30";
      if (lower === "fear-mongering") return "bg-red-500/15 text-red-300 border-red-500/30";
      if (lower === "angry") return "bg-rose-500/15 text-rose-300 border-rose-500/30";
    }
    if (lower === "low") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    if (lower === "medium" || lower === "balanced") return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
    return "bg-red-500/15 text-red-300 border-red-500/30";
  };

  return (
    <div className="glass group flex h-full flex-col rounded-[2rem] p-8">
      {/* Top Label */}
      <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-6">
        <h2 className="flex items-center gap-3 text-sm font-black tracking-[0.2em] text-slate-400 uppercase">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Credibility Matrix
        </h2>
      </div>

      {/* Main Score HUD */}
      <div className="mb-8 rounded-2xl border border-slate-700/50 bg-slate-950/80 p-6 shadow-inner relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        <div className="relative z-10 flex items-end justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
              Confidence Index
            </p>
            <p className={`text-6xl font-black tracking-tighter ${getScoreColor(score)}`}>
              {score}%
            </p>
            <p className="text-xs font-medium text-slate-400 mt-2 tracking-widest uppercase">
              {getRiskLabel(score)}
            </p>
          </div>
        </div>

        {/* LED Bar Graph */}
        <div className="relative z-10 flex gap-1.5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-sm transition-all duration-1000 ${
                i < score / 5 ? getScoreBarColor(score) : "bg-slate-800/50"
              }`}
              style={{ transitionDelay: `${i * 30}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { label: "Detected Bias", value: bias, type: "bias" },
          { label: "Clickbait Risk", value: clickbait, type: "clickbait" },
          { label: "Emotional Tone", value: tone, type: "tone" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/5 bg-slate-900/50 p-4 transition-colors hover:bg-slate-800/50"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              {item.label}
            </p>
            <span className={`inline-block rounded-md border px-3 py-1.5 text-[10px] font-black tracking-wider uppercase ${getBadgeStyle(item.value, item.type)}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Reasoning Output */}
      <div className="mt-auto rounded-xl border-l-2 border-indigo-500 bg-indigo-500/5 p-5">
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          System Reasoning
        </p>
        <p className="text-sm font-light leading-relaxed text-slate-300 italic">
          "{explanation}"
        </p>
      </div>
    </div>
  );
}

export default CredibilityBox;