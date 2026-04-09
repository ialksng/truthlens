import { Link, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";
import { logoutUser } from "../services/authApi";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const loggedIn = isLoggedIn();

  const navClass = (path) =>
    location.pathname === path
      ? "text-cyan-400"
      : "text-slate-300 hover:text-cyan-400 transition";

  const handleLogout = () => {
    logoutUser();
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold tracking-wide text-cyan-400">
          TruthLens
        </Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className={navClass("/")}>Home</Link>
          <Link to="/compare" className={navClass("/compare")}>Compare</Link>
          <Link to="/saved" className={navClass("/saved")}>Saved</Link>

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="text-slate-300 transition hover:text-red-400"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className={navClass("/login")}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;