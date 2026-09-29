import { useState, useEffect } from "react";
import Navbar          from "./components/Navbar";
import LandingPage     from "./components/LandingPage";
import PantryDashboard from "./components/PantryDashboard";
import RecipeSection   from "./components/RecipeSection";
import AboutPage       from "./components/AboutPage";
import ContactPage     from "./components/ContactPage";
import AuthModal       from "./components/AuthModal";
import { tokenStorage } from "./services/api";
import "./index.css";

export default function App() {
  const [authed,    setAuthed]    = useState(!!tokenStorage.get());
  const [view,      setView]      = useState("home");
  const [authModal, setAuthModal] = useState(null); // null | "login" | "register"
  const [itemCount, setItemCount] = useState(0);

  // Google OAuth2 redirect: captures ?token= from backend redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    if (token) {
      tokenStorage.set(token);
      setAuthed(true);
      setView("pantry");
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const handleLogout = () => {
    tokenStorage.remove();
    setAuthed(false);
    setView("home");
  };

  const handleAuthSuccess = () => {
    setAuthed(true);
    setAuthModal(null);
    setView("pantry");
  };

  // Protected pages require login
  const handleNavigate = (page) => {
    if ((page === "pantry" || page === "recipes") && !authed) {
      setAuthModal("login");
      return;
    }
    setView(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--f50)", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <Navbar
        authed={authed}
        activeView={view}
        itemCount={itemCount}
        onNavigate={handleNavigate}
        onOpenLogin={() => setAuthModal("login")}
        onOpenRegister={() => setAuthModal("register")}
        onLogout={handleLogout}
      />

      <main>
        {view === "home"    && <LandingPage onGetStarted={() => authed ? handleNavigate("pantry") : setAuthModal("register")} onNavigate={handleNavigate} />}
        {view === "pantry"  && authed && <div style={S.page}><PantryDashboard onItemCountChange={setItemCount} /></div>}
        {view === "recipes" && authed && <RecipeSection />}
        {view === "about"   && <AboutPage />}
        {view === "contact" && <ContactPage />}
      </main>

      {authModal && (
        <AuthModal
          initialMode={authModal}
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setAuthModal(null)}
        />
      )}
    </div>
  );
}

const S = {
  page: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "clamp(24px,4vw,40px) clamp(20px,4vw,40px)",
  },
};