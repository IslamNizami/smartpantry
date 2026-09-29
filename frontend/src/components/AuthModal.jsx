import { useState, useEffect } from "react";
import { Leaf, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, X } from "lucide-react";
import { authApi, tokenStorage } from "../services/api";

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

export default function AuthModal({ initialMode, onAuthSuccess, onClose }) {
  const [mode,     setMode]     = useState(initialMode || "login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      if (mode === "register") {
        const res = await authApi.register(email, password);
        setSuccess(res.data);
        setMode("login");
        setPassword("");
      } else {
        const res = await authApi.login(email, password);
        tokenStorage.set(res.data);
        onAuthSuccess();
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === "login" ? "register" : "login");
    setError(""); setSuccess("");
  };

  return (
    <>
      <style>{MODAL_CSS}</style>
      <div className="auth-overlay" onClick={onClose}>
        <div className="auth-panel animate-slide-up" onClick={e => e.stopPropagation()}>

          {/* Close */}
          <button className="auth-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>

          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon"><Leaf size={20} color="#fff" strokeWidth={2.5} /></div>
            <div>
              <div className="auth-logo-name">SmartPantry</div>
              <div className="auth-logo-sub">Kitchen Intelligence</div>
            </div>
          </div>

          <div className="auth-title-block">
            <h2 className="auth-title">{mode === "login" ? "Welcome back" : "Create account"}</h2>
            <p className="auth-subtitle">
              {mode === "login" ? "Sign in to manage your pantry" : "Join to start tracking your ingredients"}
            </p>
          </div>

          {success && (
            <div className="auth-success">
              <CheckCircle size={14} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div className="error-banner">
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="auth-field">
            <label className="form-label">Email</label>
            <div className="auth-input-wrap">
              <Mail size={13} className="auth-input-icon" />
              <input
                className="input-field"
                style={{ paddingLeft: 34 }}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="form-label">
              Password {mode === "register" && <span style={{ color: "var(--f300)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>· 8–16 chars</span>}
            </label>
            <div className="auth-input-wrap">
              <Lock size={13} className="auth-input-icon" />
              <input
                className="input-field"
                style={{ paddingLeft: 34, paddingRight: 38 }}
                type={showPass ? "text" : "password"}
                placeholder={mode === "register" ? "Min. 8 characters" : "Your password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                disabled={loading}
              />
              <button className="auth-eye" type="button" onClick={() => setShowPass(s => !s)} tabIndex={-1}>
                {showPass ? <EyeOff size={13} color="var(--f400)" /> : <Eye size={13} color="var(--f400)" />}
              </button>
            </div>
          </div>

          <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleSubmit} disabled={loading}>
            {loading
              ? <span className="animate-spin" style={{ display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%" }} />
              : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <span className="auth-divider-line" />
          </div>

          <a href="http://localhost:8080/oauth2/authorization/google" className="auth-google">
            <GoogleIcon /> Continue with Google
          </a>

          <p className="auth-switch">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button className="auth-switch-link" onClick={switchMode}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

const MODAL_CSS = `
.auth-overlay {
  position: fixed; inset: 0; z-index: 500;
  display: flex; align-items: center; justify-content: center; padding: 24px;
  background: rgba(10,30,11,.55); backdrop-filter: blur(8px);
  animation: auth-overlay-in .2s ease both;
}
@keyframes auth-overlay-in { from { opacity: 0; } to { opacity: 1; } }

.auth-panel {
  background: #fff; border-radius: 20px;
  border: 1px solid var(--f100); box-shadow: 0 24px 80px rgba(0,0,0,.18);
  padding: 32px 28px; width: 100%; max-width: 400px;
  display: flex; flex-direction: column; gap: 14px;
  position: relative;
}
.auth-close {
  position: absolute; top: 14px; right: 14px;
  background: none; border: none; cursor: pointer;
  color: var(--f300); padding: 6px; border-radius: 8px;
  transition: background .12s, color .12s;
}
.auth-close:hover { background: var(--f50); color: var(--f600); }

.auth-logo {
  display: flex; align-items: center; gap: 10px;
  padding-bottom: 14px; border-bottom: 1px solid var(--f100);
}
.auth-logo-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: var(--f500); display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(46,125,50,.28); flex-shrink: 0;
}
.auth-logo-name { font-family: 'DM Serif Display', Georgia, serif; font-size: 17px; color: var(--f800); line-height: 1.2; }
.auth-logo-sub { font-size: 9px; font-weight: 700; color: var(--f400); text-transform: uppercase; letter-spacing: .1em; }

.auth-title-block { margin-bottom: 2px; }
.auth-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 22px; color: var(--f900); }
.auth-subtitle { font-size: 13px; color: var(--f400); margin-top: 3px; }

.auth-success {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 10px 12px; background: #f0fdf4;
  border: 1px solid #bbf7d0; border-radius: var(--radius);
  font-size: 13px; color: #166534;
}
.auth-field { display: flex; flex-direction: column; gap: 5px; }
.auth-input-wrap { position: relative; }
.auth-input-icon {
  position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
  color: var(--f300); pointer-events: none;
}
.auth-eye {
  position: absolute; right: 9px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; padding: 3px;
  display: flex; align-items: center;
}

.auth-divider { display: flex; align-items: center; gap: 10px; margin: 2px 0; }
.auth-divider-line { flex: 1; height: 1px; background: var(--f100); }
.auth-divider-text { font-size: 11px; color: var(--f300); }

.auth-google {
  display: flex; align-items: center; justify-content: center; gap: 9px;
  padding: 10px 16px; border-radius: var(--radius);
  border: 1px solid var(--f200); background: #fff;
  font-size: 13.5px; font-weight: 500; color: var(--f800);
  cursor: pointer; text-decoration: none;
  font-family: 'DM Sans', sans-serif;
  transition: background .14s, border-color .14s;
}
.auth-google:hover { background: var(--f50); border-color: var(--f300); }

.auth-switch { font-size: 12.5px; color: var(--f400); text-align: center; }
.auth-switch-link {
  background: none; border: none; cursor: pointer;
  color: var(--f500); font-weight: 600; font-size: 12.5px;
  font-family: 'DM Sans', sans-serif;
}
`;