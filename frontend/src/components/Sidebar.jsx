import { ChefHat, Package, LogOut, Leaf } from "lucide-react";
import { tokenStorage } from "../services/api";

const NAV_ITEMS = [
  { id: "dashboard", label: "Pantry",  icon: Package },
  { id: "recipes",   label: "Recipes", icon: ChefHat },
];

// Decode JWT payload to get email (no library needed)
function getEmailFromToken() {
  const token = tokenStorage.get();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
}

// "bme-chef@example.com" → "BC"
function initials(email) {
  if (!email) return "?";
  const name = email.split("@")[0];
  const parts = name.split(/[._\-+]/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const S = {
  aside: {
    width: "100%", height: "100%",
    background: "#ffffff", borderRight: "1px solid #d9edda",
    display: "flex", flexDirection: "column",
    boxShadow: "1px 0 0 #d9edda",
  },
  logo: {
    padding: "18px 20px", borderBottom: "1px solid #d9edda",
    display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
  },
  logoIcon: {
    width: 34, height: 34, background: "#2e7d32", borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,.12)",
  },
  logoName: {
    fontFamily: "'DM Serif Display', Georgia, serif",
    fontSize: 17, color: "#123514", lineHeight: 1.2,
  },
  logoSub: {
    fontSize: 9, fontWeight: 700, color: "#4da155",
    textTransform: "uppercase", letterSpacing: ".12em",
  },
  nav: {
    flex: 1, padding: "12px 10px",
    display: "flex", flexDirection: "column", gap: 2, overflowY: "auto",
  },
  footer: {
    padding: "10px", borderTop: "1px solid #d9edda", flexShrink: 0,
  },
  userBlock: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 10px", borderRadius: 10,
  },
  avatar: {
    width: 30, height: 30, borderRadius: "50%",
    background: "linear-gradient(135deg,#a8c49e,#4da155)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
  },
  userEmail: {
    fontSize: 11, fontWeight: 600, color: "#123514",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  userSub: { fontSize: 10, color: "#4da155", fontFamily: "'JetBrains Mono',monospace" },
  logoutBtn: {
    display: "flex", alignItems: "center", gap: 8,
    width: "100%", padding: "8px 12px", marginTop: 4,
    borderRadius: 10, border: "none", background: "none",
    cursor: "pointer", color: "#dc2626", fontSize: 12, fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    transition: "background .15s",
  },
};

export default function Sidebar({ activeView, onNavigate, itemCount, onLogout }) {
  const email = getEmailFromToken();

  return (
    <aside style={S.aside}>
      {/* Logo */}
      <div style={S.logo}>
        <div style={S.logoIcon}>
          <Leaf size={17} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={S.logoName}>Pantry</div>
          <div style={S.logoSub}>Smart Kitchen</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={S.nav}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`nav-link${activeView === id ? " active" : ""}`}
            style={{ width: "100%" }}
          >
            <Icon size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
            {id === "dashboard" && itemCount > 0 && (
              <span style={{
                marginLeft: "auto",
                background: activeView === "dashboard" ? "rgba(255,255,255,.22)" : "#d9edda",
                color: activeView === "dashboard" ? "#fff" : "#256427",
                fontSize: 10, fontWeight: 700,
                padding: "1px 7px", borderRadius: 20,
              }}>
                {itemCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer — user info + logout */}
      <div style={S.footer}>
        <div style={S.userBlock}>
          <div style={S.avatar}>{initials(email)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={S.userEmail}>{email || "Signed in"}</div>
            <div style={S.userSub}>authenticated</div>
          </div>
        </div>

        <button
          style={S.logoutBtn}
          onClick={onLogout}
          onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  );
}