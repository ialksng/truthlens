import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ArticleDetails from "./pages/ArticleDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SavedArticles from "./pages/SavedArticles";
import CompareNews from "./pages/CompareNews";
import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article" element={<ArticleDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/compare" element={<CompareNews />} />

        <Route element={<AuthGuard />}>
            <Route path="/saved" element={<SavedArticles />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;