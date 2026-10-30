import { Link, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";
import { logoutUser } from "../services/authApi";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const loggedIn = isLoggedIn();

  const navClass = (path) =>
    `relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
      location.pathname === path
        ? "text-cyan-400 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-cyan-400 after:shadow-[0_0_8px_#22d3ee]"
        : "text-slate-400 hover:text-white hover:-translate-y-0.5"
    }`;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="fixed top-0 z-50 w-full px-6 pt-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-4 shadow-lg backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
          <span className="text-white">Truth</span>
          <span className="text-gradient-cyan">Lens</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className={navClass("/")}>Home</Link>
          <Link to="/compare" className={navClass("/compare")}>Compare</Link>
          <Link to="/saved" className={navClass("/saved")}>Saved</Link>

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="ml-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 transition-all hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className="ml-4 rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;