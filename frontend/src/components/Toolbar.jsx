import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CafeIcon from "./CafeIcon";
import AIAssistant from "./AIAssistant";
import { getThemePreference, setThemePreference } from "../lib/storage";
import { useLanguage } from "./LanguageProvider";
import CafeWordmark from "./CafeWordmark";

const navItems = [
  { label: "Home", icon: "home", path: "/menu" },
  { label: "Browse", icon: "browse", path: "/browse" },
  { label: "Rewards", icon: "rewards", path: "/rewards" },
  { label: "Track", icon: "track", path: "/tracking" },
  { label: "Analytics", icon: "analytics", path: "/analytics" },
  { label: "Profile", icon: "profile", path: "/profile" },
];

function Toolbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [theme, setTheme] = useState(getThemePreference);
  const { t } = useLanguage();

  const activePath = useMemo(() => {
    if (location.pathname.startsWith("/browse")) return "/browse";
    if (location.pathname.startsWith("/tracking")) return "/tracking";
    if (location.pathname.startsWith("/analytics")) return "/analytics";
    if (location.pathname.startsWith("/profile")) return "/profile";
    if (location.pathname.startsWith("/rewards") || location.pathname.startsWith("/orders")) return "/rewards";
    return "/menu";
  }, [location.pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    setThemePreference(nextTheme);
  };

  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === "dark");
  }, [theme]);

  return (
    <>
      <header className="app-navbar-wrap">
        <div className="app-navbar">
          <button type="button" className="app-navbar__brand" onClick={() => navigate("/menu")}>
            <span>
              <strong><CafeWordmark compact /></strong>
              <small>{t("AI-Powered")}</small>
            </span>
          </button>

          <nav className="app-navbar__nav" aria-label="Application">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`app-navbar__link ${activePath === item.path ? "is-active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <CafeIcon kind={item.icon} />
                <span>{t(item.label)}</span>
              </button>
            ))}
          </nav>

          <div className="app-navbar__actions">
            <button
              type="button"
              className="app-navbar__icon-btn is-filled"
              onClick={() => setAssistantOpen(true)}
              aria-label="Open assistant"
            >
              <CafeIcon kind="chat" />
              <span className="app-navbar__status-dot" />
            </button>
            <button type="button" className="app-navbar__icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              <CafeIcon kind="spark" />
            </button>
            <button type="button" className="app-navbar__icon-plain" onClick={() => navigate("/cart")} aria-label="Open cart">
              <CafeIcon kind="cart" />
            </button>
          </div>
        </div>
      </header>

      <AIAssistant open={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </>
  );
}

export default Toolbar;
