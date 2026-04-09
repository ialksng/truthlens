function CredibilityBox({ analysis }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-cyan-400">
        Credibility Analysis
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Credibility Score</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {analysis?.credibilityScore || "78"}/100
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Clickbait Level</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {analysis?.clickbaitLevel || "Medium"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Bias Level</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {analysis?.biasLevel || "Low"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Emotional Tone</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {analysis?.emotionalTone || "Neutral"}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4">
        <p className="text-sm text-slate-400">AI Explanation</p>
        <p className="mt-3 leading-7 text-slate-300">
          {analysis?.explanation ||
            "This article appears reasonably credible, but some claims may require additional source verification. Language is mostly neutral with moderate headline sensationalism."}
        </p>
      </div>
    </div>
  );
}

export default CredibilityBox;