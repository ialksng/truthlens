function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  return (
    <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg md:flex-row">
      <input
        type="text"
        placeholder="Search news topics, trends, or headlines..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
      />
      <button
        onClick={onSearch}
        className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;