import { useState } from "react";
import { Leaf, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { authApi, tokenStorage } from "../services/api";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode]           = useState("login"); // "login" | "register"
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        const res = await authApi.register(email, password);
        setSuccess(res.data);
        setMode("login");
        setPassword("");
      } else {
        const res = await authApi.login(email, password);
        tokenStorage.set(res.data);  // store JWT
        onAuthSuccess();
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const switchMode = () => {
    setMode(m => m === "login" ? "register" : "login");
    setError("");
    setSuccess("");
  };

  return (
    <div style={S.page}>
      {/* Background decoration */}
      <div style={S.bgCircle1} />
      <div style={S.bgCircle2} />

      <div style={S.card} className="animate-slide-up">
        {/* Logo */}
        <div style={S.logo}>
          <div style={S.logoIcon}>
            <Leaf size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={S.logoName}>Smart Pantry</div>
            <div style={S.logoSub}>Kitchen Intelligence</div>
          </div>
        </div>

        {/* Title */}
        <div style={S.titleBlock}>
          <h1 style={S.title}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p style={S.subtitle}>
            {mode === "login"
              ? "Sign in to manage your pantry"
              : "Join to start tracking your ingredients"}
          </p>
        </div>

        {/* Success banner */}
        {success && (
          <div style={S.successBanner} className="animate-fade-in">
            <CheckCircle size={15} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="error-banner animate-fade-in">
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Email */}
        <div style={S.field}>
          <label className="form-label">Email</label>
          <div style={S.inputWrap}>
            <Mail size={14} style={S.inputIcon} />
            <input
              className="input-field"
              style={{ paddingLeft: 36 }}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoFocus
            />
          </div>
        </div>

        {/* Password */}
        <div style={S.field}>
          <label className="form-label">
            Password
            {mode === "register" && (
              <span style={S.hint}> · 8–16 characters</span>
            )}
          </label>
          <div style={S.inputWrap}>
            <Lock size={14} style={S.inputIcon} />
            <input
              className="input-field"
              style={{ paddingLeft: 36, paddingRight: 40 }}
              type={showPass ? "text" : "password"}
              placeholder={mode === "register" ? "Min. 8 characters" : "Your password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              style={S.eyeBtn}
              onClick={() => setShowPass(s => !s)}
              tabIndex={-1}
              type="button"
            >
              {showPass
                ? <EyeOff size={14} color="var(--f400)" />
                : <Eye    size={14} color="var(--f400)" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <span className="animate-spin" style={S.spinner} />
            : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        {/* Google OAuth */}
        <div style={S.divider}>
          <span style={S.dividerLine} />
          <span style={S.dividerText}>or</span>
          <span style={S.dividerLine} />
        </div>

        <a href="http://localhost:8080/oauth2/authorization/google" style={S.googleBtn}>
          <GoogleIcon />
          Continue with Google
        </a>

        {/* Switch mode */}
        <p style={S.switchText}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button style={S.switchLink} onClick={switchMode}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 4.8C9.8 39.7 16.4 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.7 5.8l6.2 5.2C40.7 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
    </svg>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--f50)",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  },
  bgCircle1: {
    position: "fixed", top: -120, right: -120,
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(46,125,50,.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  bgCircle2: {
    position: "fixed", bottom: -80, left: -80,
    width: 300, height: 300, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(77,161,85,.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    background: "#fff",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--f100)",
    boxShadow: "var(--shadow-lift)",
    padding: "36px 32px",
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    position: "relative",
    zIndex: 1,
  },
  logo: {
    display: "flex", alignItems: "center", gap: 12,
    paddingBottom: 16, borderBottom: "1px solid var(--f100)",
    marginBottom: 4,
  },
  logoIcon: {
    width: 42, height: 42,
    background: "var(--f500)",
    borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 8px rgba(46,125,50,.3)",
    flexShrink: 0,
  },
  logoName: {
    fontFamily: "'DM Serif Display', Georgia, serif",
    fontSize: 19, color: "var(--f800)", lineHeight: 1.2,
  },
  logoSub: {
    fontSize: 10, fontWeight: 700, color: "var(--f400)",
    textTransform: "uppercase", letterSpacing: ".12em",
  },
  titleBlock: { marginBottom: 4 },
  title: {
    fontFamily: "'DM Serif Display', Georgia, serif",
    fontSize: 26, color: "var(--f900)", lineHeight: 1.2,
  },
  subtitle: { fontSize: 13, color: "var(--f400)", marginTop: 4 },
  successBanner: {
    display: "flex", alignItems: "flex-start", gap: 8,
    padding: 12, background: "#f0fdf4",
    border: "1px solid #bbf7d0", borderRadius: "var(--radius)",
    fontSize: 13, color: "#166534",
  },
  field: { display: "flex", flexDirection: "column", gap: 0 },
  inputWrap: { position: "relative" },
  inputIcon: {
    position: "absolute", left: 12, top: "50%",
    transform: "translateY(-50%)", color: "var(--f300)", pointerEvents: "none",
  },
  eyeBtn: {
    position: "absolute", right: 10, top: "50%",
    transform: "translateY(-50%)", background: "none",
    border: "none", cursor: "pointer", padding: 4,
    display: "flex", alignItems: "center",
  },
  hint: { color: "var(--f300)", fontWeight: 400, textTransform: "none", letterSpacing: 0 },
  spinner: {
    display: "inline-block", width: 16, height: 16,
    border: "2px solid rgba(255,255,255,.3)",
    borderTopColor: "#fff", borderRadius: "50%",
  },
  divider: {
    display: "flex", alignItems: "center", gap: 10, margin: "4px 0",
  },
  dividerLine: { flex: 1, height: 1, background: "var(--f100)" },
  dividerText: { fontSize: 12, color: "var(--f300)", flexShrink: 0 },
  googleBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    padding: "10px 18px", borderRadius: "var(--radius)",
    border: "1px solid var(--f200)", background: "#fff",
    fontSize: 14, fontWeight: 500, color: "var(--f800)",
    cursor: "pointer", textDecoration: "none",
    transition: "background .15s, border-color .15s",
    fontFamily: "'DM Sans', sans-serif",
  },
  switchText: { fontSize: 13, color: "var(--f400)", textAlign: "center", marginTop: 4 },
  switchLink: {
    background: "none", border: "none", cursor: "pointer",
    color: "var(--f500)", fontWeight: 600, fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
  },
};