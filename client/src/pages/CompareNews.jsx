import { useState } from "react";

function CompareNews() {
  const [topic, setTopic] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-4 text-4xl font-bold">Compare News</h1>
      <p className="mb-8 text-slate-400">
        Compare how multiple sources cover the same topic.
      </p>

      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Enter topic (e.g. AI, Elections, Tesla)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
          <button className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
            Compare
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
        Comparison results will appear here after backend integration.
      </div>
    </div>
  );
}

export default CompareNews;