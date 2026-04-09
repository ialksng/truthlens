function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>
      <p className="mt-4 text-slate-400">Loading latest news...</p>
    </div>
  );
}

export default Loader;