import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginUser({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-20">
      <div className="glass group relative w-full max-w-md overflow-hidden rounded-[2.5rem] p-10 shadow-2xl">
        
        {/* Animated Background Accents */}
        <div className="absolute -left-20 -top-20 h-40 w-40 animate-pulse rounded-full bg-cyan-500/20 blur-[60px]" />
        <div className="absolute -bottom-20 -right-20 h-40 w-40 animate-pulse rounded-full bg-indigo-500/20 blur-[60px]" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">System Access</h1>
            <p className="mt-2 text-sm text-slate-400">Authenticate to access your secure intelligence vault.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-cyan-400">Agent Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@truthlens.ai"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-cyan-400">Passcode</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group/btn relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-xl border border-cyan-500 bg-cyan-500/10 px-4 py-4 text-sm font-bold tracking-[0.2em] text-cyan-300 transition-all hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              ) : (
                "INITIALIZE LOGIN"
              )}
            </button>
          </form>

          {/* Cross-Link */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Lacking security clearance?{" "}
            <Link to="/register" className="font-bold tracking-wider text-cyan-400 transition hover:text-cyan-300 hover:underline">
              REQUEST ACCESS
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;