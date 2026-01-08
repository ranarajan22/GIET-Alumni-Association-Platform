import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SEARCHABLE_CONTENT = [
  { title: "Home", path: "/", category: "Pages", protected: false },
  { title: "About", path: "/about", category: "Pages", protected: false },
  { title: "Features", path: "/features", category: "Pages", protected: false },
  { title: "Contact", path: "/contact", category: "Pages", protected: false },
  { title: "Support", path: "/supportus", category: "Pages", protected: false },
  { title: "Login", path: "/login", category: "Auth", protected: false },
  { title: "Register", path: "/roleselection", category: "Auth", protected: false },
  { title: "Dashboard", path: "/dashboard", category: "Private", protected: true },
  { title: "Admin", path: "/admin", category: "Private", protected: true },
];

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isAuthed, setIsAuthed] = useState(Boolean(localStorage.getItem("token")));
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => setIsAuthed(Boolean(localStorage.getItem("token")));
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchTerm.trim()) {
        setResults([]);
        setShowResults(false);
        setHighlightedIndex(0);
        return;
      }
      const filtered = SEARCHABLE_CONTENT
        .filter((item) => isAuthed || !item.protected)
        .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
      setResults(filtered);
      setShowResults(true);
      setHighlightedIndex(0);
    }, 180);
    return () => clearTimeout(handler);
  }, [searchTerm, isAuthed]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setShowResults(true);
  };

  const handleResultClick = (path) => {
    const selected = SEARCHABLE_CONTENT.find((item) => item.path === path);
    if (selected?.protected && !isAuthed) {
      navigate("/login");
      return;
    }
    navigate(path);
    setSearchTerm("");
    setShowResults(false);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e) => {
    if (!showResults || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const choice = results[highlightedIndex];
      if (choice) handleResultClick(choice.path);
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchTerm && setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <FaSearch className="absolute left-3 top-3 text-slate-500" />
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden">
          {results.length > 0 ? (
            results.map((result, index) => (
              <button
                key={index}
                onClick={() => handleResultClick(result.path)}
                className={`w-full text-left px-4 py-3 transition border-b border-slate-800 last:border-b-0 ${
                  highlightedIndex === index ? "bg-slate-800" : "hover:bg-slate-800"
                }`}
              >
                <div className="font-semibold text-slate-100">{result.title}</div>
                <div className="text-xs text-slate-400">{result.category}</div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-slate-400 text-sm">No results for &quot;{searchTerm}&quot;</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
