// client/src/components/AuthGuard.jsx
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../services/authService";

function AuthGuard() {

  const authenticated = isLoggedIn();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AuthGuard;