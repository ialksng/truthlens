import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authApi";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerUser({ name, email, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration sequence failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-20">
      <div className="glass group relative w-full max-w-md overflow-hidden rounded-[2.5rem] p-10 shadow-2xl">
        
        {/* Animated Background Accents */}
        <div className="absolute -right-20 -top-20 h-40 w-40 animate-pulse rounded-full bg-indigo-500/20 blur-[60px]" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 animate-pulse rounded-full bg-cyan-500/20 blur-[60px]" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Create Protocol</h1>
            <p className="mt-2 text-sm text-slate-400">Register a new identity to access the Neural Engine.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-indigo-400">Designation (Name)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Agent Smith"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-indigo-400">Secure Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@truthlens.ai"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-indigo-400">Passcode</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group/btn relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-xl border border-indigo-500 bg-indigo-500/10 px-4 py-4 text-sm font-bold tracking-[0.2em] text-indigo-300 transition-all hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
              ) : (
                "ESTABLISH IDENTITY"
              )}
            </button>
          </form>

          {/* Cross-Link */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Already possess clearance?{" "}
            <Link to="/login" className="font-bold tracking-wider text-indigo-400 transition hover:text-indigo-300 hover:underline">
              AUTHENTICATE HERE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;