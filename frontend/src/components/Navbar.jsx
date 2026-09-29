import { useState, useEffect, useRef } from "react";
import { Leaf, Package, ChefHat, Info, Mail, LogOut, User, ChevronDown, Menu, X } from "lucide-react";
import { tokenStorage } from "../services/api";

function getEmailFromToken() {
  const token = tokenStorage.get();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])).sub || null;
  } catch { return null; }
}

function initials(email) {
  if (!email) return "?";
  const name = email.split("@")[0];
  const parts = name.split(/[._\-+]/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const NAV_LINKS = [
  { id: "pantry",   label: "Pantry",   icon: Package,  protected: true  },
  { id: "recipes",  label: "Recipes",  icon: ChefHat,  protected: true  },
  { id: "about",    label: "About",    icon: Info,     protected: false },
  { id: "contact",  label: "Contact",  icon: Mail,     protected: false },
];

export default function Navbar({ authed, activeView, itemCount, onNavigate, onOpenLogin, onOpenRegister, onLogout }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const menuRef = useRef(null);
  const email   = getEmailFromToken();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleNav = (id) => {
    onNavigate(id);
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <>
      <style>{NAV_CSS}</style>
      <header className={`sp-nav${scrolled ? " sp-nav--scrolled" : ""}`}>
        <div className="sp-nav__inner">

          {/* Logo */}
          <button className="sp-nav__logo" onClick={() => handleNav("home")}>
            <div className="sp-nav__logo-icon">
              <Leaf size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="sp-nav__logo-name">Smart<em>Pantry</em></span>
          </button>

          {/* Desktop Links */}
          <nav className="sp-nav__links">
            {NAV_LINKS.map(({ id, label, icon: Icon, protected: prot }) => (
              <button
                key={id}
                className={`sp-nav__link${activeView === id ? " sp-nav__link--active" : ""}${prot && !authed ? " sp-nav__link--locked" : ""}`}
                onClick={() => handleNav(id)}
                title={prot && !authed ? "Sign in to access" : undefined}
              >
                <Icon size={14} strokeWidth={2} />
                {label}
                {id === "pantry" && authed && itemCount > 0 && (
                  <span className="sp-nav__badge">{itemCount}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Right — auth or user */}
          <div className="sp-nav__right">
            {!authed ? (
              <>
                <button className="sp-nav__btn sp-nav__btn--ghost" onClick={onOpenLogin}>Sign In</button>
                <button className="sp-nav__btn sp-nav__btn--solid" onClick={onOpenRegister}>Get Started</button>
              </>
            ) : (
              <div className="sp-nav__user" ref={menuRef}>
                <button className="sp-nav__user-btn" onClick={() => setUserMenuOpen(o => !o)}>
                  <div className="sp-nav__avatar">{initials(email)}</div>
                  <ChevronDown size={13} className={`sp-nav__chevron${userMenuOpen ? " open" : ""}`} />
                </button>
                {userMenuOpen && (
                  <div className="sp-nav__dropdown">
                    <div className="sp-nav__dropdown-email">
                      <User size={12} />
                      <span>{email}</span>
                    </div>
                    <div className="sp-nav__dropdown-divider" />
                    <button className="sp-nav__dropdown-item" onClick={() => { handleNav("pantry"); }}>
                      <Package size={14} /> My Pantry
                    </button>
                    <button className="sp-nav__dropdown-item" onClick={() => { handleNav("recipes"); }}>
                      <ChefHat size={14} /> Recipes
                    </button>
                    <div className="sp-nav__dropdown-divider" />
                    <button className="sp-nav__dropdown-item sp-nav__dropdown-item--danger" onClick={() => { onLogout(); setUserMenuOpen(false); }}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button className="sp-nav__hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="sp-nav__mobile">
            {NAV_LINKS.map(({ id, label, icon: Icon, protected: prot }) => (
              <button
                key={id}
                className={`sp-nav__mobile-link${activeView === id ? " active" : ""}`}
                onClick={() => handleNav(id)}
              >
                <Icon size={16} />
                {label}
                {prot && !authed && <span className="sp-nav__mobile-lock">🔒</span>}
                {id === "pantry" && authed && itemCount > 0 && (
                  <span className="sp-nav__badge">{itemCount}</span>
                )}
              </button>
            ))}
            <div className="sp-nav__mobile-divider" />
            {!authed ? (
              <div style={{ display: "flex", gap: 8, padding: "4px 16px 12px" }}>
                <button className="sp-nav__btn sp-nav__btn--ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onOpenLogin(); setMobileOpen(false); }}>Sign In</button>
                <button className="sp-nav__btn sp-nav__btn--solid" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onOpenRegister(); setMobileOpen(false); }}>Get Started</button>
              </div>
            ) : (
              <div style={{ padding: "4px 16px 12px" }}>
                <div style={{ fontSize: 11, color: "var(--f400)", marginBottom: 8, fontFamily: "monospace" }}>{email}</div>
                <button className="sp-nav__btn sp-nav__btn--ghost" style={{ width: "100%", justifyContent: "center", color: "#dc2626" }} onClick={() => { onLogout(); setMobileOpen(false); }}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}

const NAV_CSS = `
.sp-nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(240,247,240,0.85);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid transparent;
  transition: background .25s, border-color .25s, box-shadow .25s;
}
.sp-nav--scrolled {
  background: rgba(255,255,255,0.95);
  border-color: var(--f100);
  box-shadow: 0 1px 20px rgba(0,0,0,.06);
}
.sp-nav__inner {
  max-width: 1280px; margin: 0 auto;
  padding: 0 clamp(16px,4vw,40px);
  height: 64px;
  display: flex; align-items: center; gap: 8px;
}

/* Logo */
.sp-nav__logo {
  display: flex; align-items: center; gap: 9px;
  background: none; border: none; cursor: pointer; padding: 6px 0;
  text-decoration: none; flex-shrink: 0;
}
.sp-nav__logo-icon {
  width: 32px; height: 32px; border-radius: 9px;
  background: var(--f500);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(46,125,50,.28); flex-shrink: 0;
}
.sp-nav__logo-name {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 18px; color: var(--f800); line-height: 1;
  white-space: nowrap;
}
.sp-nav__logo-name em { font-style: normal; color: var(--f500); }

/* Desktop nav links */
.sp-nav__links {
  display: flex; align-items: center; gap: 2px;
  flex: 1; padding: 0 16px;
}
.sp-nav__link {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 13px; border-radius: 8px;
  font-size: 13.5px; font-weight: 500; color: var(--f600);
  background: none; border: none; cursor: pointer;
  transition: background .14s, color .14s;
  white-space: nowrap; position: relative;
}
.sp-nav__link:hover { background: var(--f100); color: var(--f800); }
.sp-nav__link--active { background: var(--f100); color: var(--f700); font-weight: 600; }
.sp-nav__link--locked { opacity: .55; }
.sp-nav__badge {
  background: var(--f500); color: #fff;
  font-size: 10px; font-weight: 700;
  padding: 1px 6px; border-radius: 20px; line-height: 1.4;
}

/* Right side */
.sp-nav__right {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-left: auto;
}
.sp-nav__btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 13.5px;
  cursor: pointer; border: none; transition: all .15s; white-space: nowrap;
}
.sp-nav__btn--ghost {
  background: none; color: var(--f600); border: 1px solid var(--f200);
}
.sp-nav__btn--ghost:hover { background: var(--f100); border-color: var(--f300); }
.sp-nav__btn--solid {
  background: var(--f500); color: #fff;
  box-shadow: 0 1px 6px rgba(46,125,50,.25);
}
.sp-nav__btn--solid:hover { background: var(--f600); }

/* User dropdown */
.sp-nav__user { position: relative; }
.sp-nav__user-btn {
  display: flex; align-items: center; gap: 6px;
  background: none; border: 1px solid var(--f200); cursor: pointer;
  border-radius: 20px; padding: 4px 10px 4px 4px;
  transition: background .14s, border-color .14s;
}
.sp-nav__user-btn:hover { background: var(--f100); border-color: var(--f300); }
.sp-nav__avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg,#a8c49e,var(--f500));
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 11px; font-weight: 700;
}
.sp-nav__chevron {
  color: var(--f400); transition: transform .2s;
}
.sp-nav__chevron.open { transform: rotate(180deg); }
.sp-nav__dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: #fff; border: 1px solid var(--f100);
  border-radius: 12px; padding: 6px;
  box-shadow: 0 8px 32px rgba(0,0,0,.12);
  min-width: 200px; z-index: 200;
  animation: sp-dropdown-in .18s cubic-bezier(.34,1.4,.64,1) both;
}
@keyframes sp-dropdown-in {
  from { opacity: 0; transform: translateY(-6px) scale(.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.sp-nav__dropdown-email {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 10px; font-size: 11px; color: var(--f400);
  font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sp-nav__dropdown-divider { height: 1px; background: var(--f100); margin: 4px 0; }
.sp-nav__dropdown-item {
  display: flex; align-items: center; gap: 9px;
  width: 100%; padding: 9px 10px; border-radius: 8px;
  font-size: 13px; font-weight: 500; color: var(--f700);
  background: none; border: none; cursor: pointer;
  transition: background .12s;
}
.sp-nav__dropdown-item:hover { background: var(--f50); }
.sp-nav__dropdown-item--danger { color: #dc2626; }
.sp-nav__dropdown-item--danger:hover { background: #fef2f2; }

/* Hamburger */
.sp-nav__hamburger {
  display: none; align-items: center; justify-content: center;
  background: none; border: none; cursor: pointer; color: var(--f600);
  padding: 6px; border-radius: 8px;
}
.sp-nav__hamburger:hover { background: var(--f100); }

/* Mobile drawer */
.sp-nav__mobile {
  border-top: 1px solid var(--f100);
  background: rgba(255,255,255,.98); backdrop-filter: blur(12px);
  padding: 8px 0;
  animation: sp-mobile-in .2s ease both;
}
@keyframes sp-mobile-in {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.sp-nav__mobile-link {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 12px 20px;
  font-size: 14px; font-weight: 500; color: var(--f700);
  background: none; border: none; cursor: pointer;
  transition: background .12s;
}
.sp-nav__mobile-link:hover, .sp-nav__mobile-link.active { background: var(--f50); }
.sp-nav__mobile-lock { margin-left: auto; font-size: 12px; opacity: .5; }
.sp-nav__mobile-divider { height: 1px; background: var(--f100); margin: 6px 0; }

@media (max-width: 768px) {
  .sp-nav__links { display: none; }
  .sp-nav__right .sp-nav__btn { display: none; }
  .sp-nav__right .sp-nav__user { display: none; }
  .sp-nav__hamburger { display: flex; }
}
`;