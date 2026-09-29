import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChefHat, Sparkles, CheckCircle2, XCircle,
  Loader2, Search, X, ArrowRight, Salad,
  Clock, CheckCircle,
} from "lucide-react";
import { recipeApi } from "../services/api";

/* ─────────────────────────────────────────────────────────────
   STYLES  (injected once into <head>)
───────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

.rs {
  --green:#2e7d32; --green-l:#f0f7f0; --green-m:#b3dbb6;
  --ink:#0f1a10;   --ink2:#3d5240;    --ink3:#7a8f7d;
  --red:#b91c1c;   --red-bg:#fef2f2;  --red-b:#fecaca;
  font-family:'DM Sans',system-ui,sans-serif; color:var(--ink);
}

/* ══ HERO ══════════════════════════════════════════════════════ */
.rs-hero {
  position:relative; overflow:hidden;
  padding:clamp(28px,5vw,60px) clamp(20px,5vw,52px) clamp(24px,4vw,52px);
  background:#fff; border-bottom:1px solid #e8f0e9;
  transition:padding .3s ease;
}
.rs-hero.slim { padding:14px clamp(16px,4vw,48px); }

.rs-hero::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    linear-gradient(135deg,rgba(46,125,50,.04) 0%,transparent 50%),
    radial-gradient(ellipse 70% 60% at 95% 50%,rgba(179,219,182,.14) 0%,transparent 65%);
}
.rs-deco {
  position:absolute; right:clamp(16px,4vw,52px); top:50%;
  transform:translateY(-50%);
  font-size:clamp(72px,10vw,160px);
  opacity:.055; line-height:1;
  pointer-events:none; user-select:none; transition:opacity .3s;
}
.rs-hero.slim .rs-deco { opacity:0; }

.rs-hero-inner {
  position:relative; z-index:1;
  max-width:1400px; margin:0 auto;
  display:flex; align-items:center;
  gap:clamp(20px,4vw,52px); flex-wrap:wrap;
}
.rs-hero.slim .rs-hero-inner { flex-wrap:nowrap; align-items:center; gap:clamp(10px,2vw,20px); }

.rs-hero-text { flex:1 1 260px; min-width:0; }
.rs-hero.slim .rs-hero-text { flex:0 0 auto; }

.rs-tag {
  display:inline-flex; align-items:center; gap:5px;
  font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
  color:var(--green); background:rgba(46,125,50,.08); border-radius:6px;
  padding:4px 10px; margin-bottom:13px;
}
.rs-hero.slim .rs-tag { display:none; }

.rs-hero h1 {
  font-family:'Instrument Serif',Georgia,serif;
  font-size:clamp(22px,3.2vw,50px); font-weight:400;
  color:var(--ink); line-height:1.08; margin:0 0 11px; letter-spacing:-.4px;
}
.rs-hero h1 em { font-style:italic; color:var(--green); }
.rs-hero.slim h1 { font-size:clamp(15px,1.8vw,19px); margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:22ch; }

.rs-hero-sub { font-size:clamp(13px,1.3vw,15px); color:var(--ink3); line-height:1.65; max-width:440px; }
.rs-hero.slim .rs-hero-sub { display:none; }

.rs-controls {
  flex:1 1 280px; min-width:0;
  display:flex; flex-direction:column; gap:9px;
}

@media (min-width:900px) {
  .rs-hero.slim .rs-controls { flex-direction:row; align-items:center; flex:1 1 0; gap:8px; }
  .rs-hero.slim .rs-field    { flex:1 1 0; min-width:0; }
  .rs-hero.slim .rs-divider  { display:none; }
}
@media (max-width:899px) {
  .rs-hero.slim .rs-controls { flex-direction:column; width:100%; }
}

.rs-field {
  display:flex; align-items:center;
  background:#f4f7f4; border:1.5px solid #d4e4d5;
  border-radius:12px; padding:4px 4px 4px 12px; gap:6px;
  transition:border-color .2s,box-shadow .2s,background .2s; min-width:0;
}
.rs-field:focus-within {
  background:#fff; border-color:var(--green);
  box-shadow:0 0 0 3px rgba(46,125,50,.10);
}
.rs-field-icon { color:#9cb89e; flex-shrink:0; }
.rs-field form { flex:1; display:flex; min-width:0; }
.rs-field input {
  flex:1; background:none; border:none; outline:none;
  font-family:'DM Sans',sans-serif; font-size:14px; color:var(--ink);
  min-width:0; padding:9px 0; width:100%;
}
.rs-field input::placeholder { color:#a8bfaa; }
.rs-field-x {
  background:none; border:none; cursor:pointer; color:#b0c4b2;
  padding:4px; border-radius:6px; display:flex; align-items:center;
  flex-shrink:0; transition:color .15s;
}
.rs-field-x:hover { color:var(--ink2); }

.rs-search-btn {
  background:var(--green); color:#fff; border:none;
  border-radius:9px; padding:9px 16px;
  font-family:'DM Sans',sans-serif; font-weight:600; font-size:13px;
  cursor:pointer; white-space:nowrap; flex-shrink:0;
  display:flex; align-items:center; gap:5px;
  transition:background .15s,transform .1s;
}
.rs-search-btn:hover:not(:disabled) { background:#256427; }
.rs-search-btn:active:not(:disabled) { transform:scale(.97); }
.rs-search-btn:disabled { opacity:.45; cursor:not-allowed; }

.rs-divider {
  display:flex; align-items:center; gap:10px;
  font-size:11px; font-weight:600; color:#b0c4b2; letter-spacing:.05em;
}
.rs-divider::before,.rs-divider::after { content:''; flex:1; height:1px; background:#e4ece5; }
.rs-hero.slim .rs-divider { display:none; }

.rs-pantry-btn {
  display:flex; align-items:center; justify-content:center; gap:8px;
  padding:11px 18px; border-radius:12px; flex-shrink:0;
  background:#fff; color:var(--green); border:1.5px solid #c2d9c3;
  font-family:'DM Sans',sans-serif; font-weight:600; font-size:13px;
  cursor:pointer; white-space:nowrap; min-width:0;
  transition:background .2s,border-color .2s,transform .15s,box-shadow .2s;
}
.rs-pantry-btn:hover:not(:disabled) {
  background:var(--green-l); border-color:var(--green);
  transform:translateY(-1px); box-shadow:0 4px 14px rgba(46,125,50,.12);
}
.rs-pantry-btn:active:not(:disabled) { transform:scale(.98); }
.rs-pantry-btn:disabled { opacity:.5; cursor:not-allowed; }

.rs-pantry-btn:focus-visible,
.rs-search-btn:focus-visible {
  outline:2px solid var(--green); outline-offset:2px;
}

/* ══ HINT CARDS ════════════════════════════════════════════════ */
.rs-hints {
  padding:clamp(16px,3vw,36px) clamp(20px,5vw,52px) clamp(20px,4vw,44px);
  max-width:1400px; margin:0 auto;
  display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:12px;
}
.rs-hint {
  background:#fff; border:1px solid #e4ece5; border-radius:13px;
  padding:16px 18px; display:flex; flex-direction:column; gap:7px;
  transition:border-color .2s,box-shadow .2s;
}
.rs-hint:hover { border-color:var(--green-m); box-shadow:0 3px 12px rgba(46,125,50,.07); }
.rs-hint-icon { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:16px; }
.rs-hint-title { font-size:13px; font-weight:600; color:var(--ink); }
.rs-hint-desc  { font-size:12px; color:var(--ink3); line-height:1.5; }

/* ══ CONTENT ═══════════════════════════════════════════════════ */
.rs-content {
  max-width:1400px; margin:0 auto;
  padding:clamp(18px,3vw,30px) clamp(20px,5vw,52px) clamp(24px,5vw,48px);
}

.rs-bar {
  display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:10px; margin-bottom:20px; padding-bottom:16px;
  border-bottom:1px solid #e8f0e9;
}
.rs-bar-left { display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; }
.rs-bar-count { font-family:'Instrument Serif',serif; font-size:24px; color:var(--ink); }
.rs-bar-label { font-size:13px; color:var(--ink3); }
.rs-bar-label em { font-style:italic; color:var(--ink2); }

.rs-new-btn {
  display:inline-flex; align-items:center; gap:5px;
  font-size:12px; font-weight:500; color:var(--ink3);
  background:none; border:1px solid #d4e4d5; border-radius:8px;
  padding:6px 12px; cursor:pointer; flex-shrink:0;
  transition:background .15s,color .15s;
}
.rs-new-btn:hover { background:var(--green-l); color:var(--green); border-color:var(--green-m); }
.rs-new-btn:focus-visible { outline:2px solid var(--green); outline-offset:2px; }

/* ══ CARD GRID ═════════════════════════════════════════════════ */
.rs-grid {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:clamp(12px,2vw,20px);
}

/* ══ RECIPE CARD  ══════════════════════════════════════════════ */
.rc {
  background:#fff; border-radius:16px; border:1px solid #e4ece5;
  overflow:hidden; cursor:pointer; text-decoration:none; display:block;
  transition:transform .28s cubic-bezier(.34,1.4,.64,1),box-shadow .28s,border-color .28s;
  animation:rc-appear .4s ease both; animation-delay:var(--d,0ms);
  outline:none;
}
@keyframes rc-appear {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0); }
}

@media (hover:hover) {
  .rc:hover {
    transform:translateY(-5px);
    box-shadow:0 18px 44px rgba(15,26,16,.10),0 4px 12px rgba(15,26,16,.06);
    border-color:#b3dbb6;
  }
  .rc:hover .rc-img img { transform:scale(1.07); }
}

.rc:active { transform:scale(.98); box-shadow:0 2px 8px rgba(15,26,16,.08); transition:transform .1s,box-shadow .1s; }

.rc:focus-visible {
  box-shadow:0 0 0 3px rgba(46,125,50,.35);
  border-color:var(--green);
}

.rc-img { position:relative; height:188px; overflow:hidden; background:#e8f0e9; }
.rc-img img { width:100%; height:100%; object-fit:cover; transition:transform .5s ease; display:block; }
.rc-img-none {
  width:100%; height:100%; display:flex; flex-direction:column;
  align-items:center; justify-content:center; color:#9cb89e; gap:7px; font-size:12px;
  background:linear-gradient(135deg,#f0f7f0,#e6ede2);
}
.rc-scrim {
  position:absolute; inset:0;
  background:linear-gradient(to bottom,transparent 28%,rgba(15,26,16,.45) 62%,rgba(15,26,16,.82) 100%);
}

.rc-ring-wrap {
  position:absolute; top:10px; right:10px; width:43px; height:43px;
  background:rgba(255,255,255,.14); backdrop-filter:blur(10px);
  border-radius:50%; display:flex; align-items:center; justify-content:center;
  border:1px solid rgba(255,255,255,.2);
}
.rc-ring { position:absolute; inset:0; width:100%; height:100%; }
.rc-ring-pct { font-size:9px; font-weight:800; color:#fff; position:relative; z-index:1; }

.rc-title-layer { position:absolute; bottom:0; left:0; right:0; padding:10px 13px; }
.rc-title {
  font-family:'Instrument Serif',Georgia,serif;
  font-size:15px; font-weight:400; color:#fff; line-height:1.3; margin:0;
  text-shadow:0 1px 5px rgba(0,0,0,.45);
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}

.rc-body { padding:13px; display:flex; flex-direction:column; gap:9px; }
.rc-section { display:flex; flex-direction:column; gap:4px; }
.rc-section-head {
  display:inline-flex; align-items:center; gap:4px;
  font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.1em;
}
.rc-section-head.have { color:#15803d; }
.rc-section-head.miss { color:#9ca3af; }
.rc-tags { display:flex; flex-wrap:wrap; gap:4px; }
.rc-tag { font-size:11px; font-weight:500; padding:3px 9px; border-radius:9999px; }
.rc-tag.have { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }
.rc-tag.miss { background:#fef2f2; color:#991b1b; border:1px solid #fecaca; }
.rc-tag.more { background:#f4f7f4; color:#4da155; border:1px solid #c2d9c3; }
.rc-bar-row { display:flex; align-items:center; gap:8px; }
.rc-bar { flex:1; height:3px; background:#e8f0e9; border-radius:3px; overflow:hidden; }
.rc-bar-fill { height:100%; border-radius:3px; }
.rc-bar-txt { font-size:10px; font-weight:600; color:var(--ink3); white-space:nowrap; }

/* ══ SKELETON ══════════════════════════════════════════════════ */
.rs-skel { background:#fff; border-radius:16px; border:1px solid #e4ece5; overflow:hidden; animation:rc-appear .4s ease both; animation-delay:var(--d,0ms); }
.rs-skel-img { height:188px; }
.rs-skel-body { padding:13px; display:flex; flex-direction:column; gap:8px; }
.rs-skel-line { border-radius:6px; }
.rs-skel-img,.rs-skel-line {
  background:linear-gradient(90deg,#e8f0e9 25%,#f4f7f4 50%,#e8f0e9 75%);
  background-size:200% 100%; animation:shimmer 1.6s linear infinite;
}
@keyframes shimmer { to { background-position:-200% 0; } }

/* ══ EMPTY / ERROR ═════════════════════════════════════════════ */
.rs-empty {
  display:flex; flex-direction:column; align-items:center;
  justify-content:center; padding:clamp(44px,7vw,76px) 24px; text-align:center;
}
.rs-empty-icon {
  width:64px; height:64px; background:var(--green-l);
  border-radius:16px; display:flex; align-items:center; justify-content:center;
  margin-bottom:16px; color:var(--green);
}
.rs-empty h3 { font-family:'Instrument Serif',serif; font-size:22px; font-weight:400; color:var(--ink); margin:0 0 7px; }
.rs-empty p  { font-size:14px; color:var(--ink3); max-width:300px; }

.rs-err { background:#fff; border:1px solid var(--red-b); border-radius:16px; padding:clamp(28px,5vw,48px) 24px; text-align:center; }
.rs-err h3 { font-family:'Instrument Serif',serif; font-size:20px; font-weight:400; color:var(--red); margin:0 0 6px; }
.rs-err p  { font-size:13px; color:var(--red); opacity:.8; margin:0 0 18px; }
.rs-retry {
  display:inline-flex; align-items:center; gap:6px;
  padding:9px 20px; background:#fff; color:var(--red);
  border:1.5px solid var(--red-b); border-radius:10px;
  font-family:'DM Sans',sans-serif; font-weight:500; font-size:13px;
  cursor:pointer; transition:background .15s;
}
.rs-retry:hover { background:var(--red-bg); }
.rs-retry:focus-visible { outline:2px solid var(--red); outline-offset:2px; }

@keyframes spin { to { transform:rotate(360deg); } }
.spin { animation:spin 1s linear infinite; display:inline-flex; }

/* ── Load More button ── */
.rs-load-more-btn {
  display:inline-flex; align-items:center; gap:8px;
  padding:12px 32px; border-radius:12px;
  background:#fff; color:var(--green);
  border:1.5px solid #c2d9c3;
  font-family:'DM Sans',sans-serif; font-weight:600; font-size:14px;
  cursor:pointer; transition:background .2s,border-color .2s,transform .15s,box-shadow .2s;
  box-shadow:0 1px 4px rgba(46,125,50,.08);
}
.rs-load-more-btn:hover:not(:disabled) {
  background:var(--green-l); border-color:var(--green);
  transform:translateY(-1px); box-shadow:0 4px 14px rgba(46,125,50,.12);
}
.rs-load-more-btn:active:not(:disabled) { transform:scale(.97); }
.rs-load-more-btn:disabled { opacity:.6; cursor:not-allowed; }

/* ══ MODAL ═════════════════════════════════════════════════════ */
@keyframes modal-overlay-in  { from { opacity:0; } to { opacity:1; } }
@keyframes modal-overlay-out { from { opacity:1; } to { opacity:0; } }
@keyframes modal-panel-in {
  from { opacity:0; transform:translateY(32px) scale(.95); }
  to   { opacity:1; transform:translateY(0)    scale(1);   }
}
@keyframes modal-panel-out {
  from { opacity:1; transform:translateY(0)    scale(1);   }
  to   { opacity:0; transform:translateY(16px) scale(.97); }
}

.rs-modal-overlay {
  position:fixed; inset:0; z-index:9999;
  display:flex; align-items:center; justify-content:center; padding:24px;
  background:rgba(0,0,0,0.55); backdrop-filter:blur(6px);
  animation:modal-overlay-in .25s cubic-bezier(.22,1,.36,1) both;
}
.rs-modal-overlay.closing {
  animation:modal-overlay-out .2s cubic-bezier(.55,0,1,.45) both;
  pointer-events:none;
}
.rs-modal {
  position:relative; width:100%; max-width:580px;
  background:#fff; border-radius:20px;
  overflow:hidden; display:flex; flex-direction:column;
  max-height:88vh;
  box-shadow:0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12);
  animation:modal-panel-in .38s cubic-bezier(.34,1.15,.64,1) both;
  animation-delay:.05s;
}
.rs-modal-overlay.closing .rs-modal {
  animation:modal-panel-out .2s cubic-bezier(.55,0,1,.45) both;
}
.rs-modal-hero { position:relative; height:260px; flex-shrink:0; overflow:hidden; }
.rs-modal-hero img { width:100%; height:100%; object-fit:cover; display:block; }
.rs-modal-hero-overlay {
  position:absolute; inset:0;
  background:linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
}
.rs-modal-title-layer {
  position:absolute; bottom:0; left:0; right:0; padding:20px 24px;
}
.rs-modal-title-layer h2 {
  margin:0; font-family:'Instrument Serif',Georgia,serif;
  font-size:22px; font-weight:400; color:#fff; line-height:1.3; letter-spacing:-.3px;
}
.rs-modal-close {
  position:absolute; top:14px; right:14px;
  width:36px; height:36px; border-radius:50%;
  background:rgba(255,255,255,0.18); border:0.5px solid rgba(255,255,255,0.25);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:background .15s;
}
.rs-modal-close:hover { background:rgba(255,255,255,0.32); }
.rs-modal-body { padding:20px 24px 28px; overflow-y:auto; flex:1; }
.rs-modal-pills { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px; }
.rs-modal-pill {
  display:flex; align-items:center; gap:6px;
  font-size:13px; font-weight:500; padding:6px 12px; border-radius:9999px;
  background:#f4f7f4; color:var(--ink3); border:1px solid #e4ece5;
}
.rs-modal-pill.green { background:#EAF3DE; color:#3B6D11; border-color:#C0DD97; }
.rs-modal-section-label {
  font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
  color:var(--ink3); margin:0 0 12px;
}
.rs-modal-steps { display:flex; flex-direction:column; }
.rs-modal-step {
  display:flex; gap:14px; padding:12px 0;
  border-bottom:1px solid #f0f4f0;
}
.rs-modal-step:last-child { border-bottom:none; }
.rs-modal-step-num {
  width:26px; height:26px; border-radius:50%; flex-shrink:0;
  background:#f4f7f4; border:1px solid #e4ece5;
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:600; color:var(--ink3); margin-top:1px;
}
.rs-modal-step-text {
  font-size:14px; line-height:1.7; color:var(--ink); padding-top:3px; margin:0;
}
.rs-modal-loader {
  display:flex; align-items:center; justify-content:center;
  padding:64px 24px;
}

/* ══ RESPONSIVE ════════════════════════════════════════════════ */
@media (max-width:820px) {
  .rs-hero-inner { flex-direction:column; align-items:stretch; gap:18px; }
  .rs-hero.slim .rs-hero-inner { flex-direction:row; align-items:center; }
  .rs-deco { display:none; }
  .rs-controls { flex:unset; width:100%; }
}
@media (max-width:520px) {
  .rs-hero.slim .rs-hero-inner { flex-wrap:wrap; }
  .rs-hero.slim .rs-controls { flex-direction:column; width:100%; }
  .rs-hero.slim h1 { font-size:14px; max-width:none; }
  .rs-content { padding:14px; }
  .rs-grid { grid-template-columns:1fr; }
  .rs-modal-hero { height:200px; }
  .rs-modal-title-layer h2 { font-size:18px; }
}
`;

function parseSteps(html) {
  if (!html) return [];
  const div = document.createElement('div');
  div.innerHTML = html;
  const listItems = div.querySelectorAll('li');
  if (listItems.length > 0) {
    return Array.from(listItems).map(li => li.textContent.trim()).filter(Boolean);
  }
  return div.textContent.split(/(?<=[.!?])\s+/).filter(Boolean);
}

/* ─────────────────────────────────────────────────────────────
   RECIPE CARD
───────────────────────────────────────────────────────────── */
function RecipeCard({ recipe }) {
  const [imgErr, setImgErr] = useState(false);
  const used   = recipe.usedIngredients   ?? [];
  const missed = recipe.missedIngredients ?? [];
  const total  = used.length + missed.length;
  const pct    = total > 0 ? Math.round((used.length / total) * 100) : 0;
  const fill   = pct >= 70 ? "#22c55e" : pct >= 40 ? "#eab308" : "#ef4444";
  const circ   = 94.25;

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  return (
    <article
      className="rc"
      tabIndex={0}
      role="button"
      aria-label={`Recipe: ${recipe.title}. ${used.length} of ${total} ingredients in your pantry.`}
      onKeyDown={handleKey}
    >
      <div className="rc-img">
        {recipe.image && !imgErr
          ? <img src={recipe.image} alt="" onError={() => setImgErr(true)} />
          : <div className="rc-img-none"><ChefHat size={30} strokeWidth={1} /><span>No photo</span></div>
        }
        <div className="rc-scrim" />
        {total > 0 && (
          <div className="rc-ring-wrap" aria-hidden="true">
            <svg className="rc-ring" viewBox="0 0 43 43">
              <circle cx="21.5" cy="21.5" r="17" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="3"/>
              <circle cx="21.5" cy="21.5" r="17" fill="none" stroke={fill} strokeWidth="3"
                strokeDasharray={`${(pct / 100) * circ} ${circ}`}
                strokeLinecap="round" transform="rotate(-90 21.5 21.5)"
              />
            </svg>
            <span className="rc-ring-pct">{pct}%</span>
          </div>
        )}
        <div className="rc-title-layer"><h3 className="rc-title">{recipe.title}</h3></div>
      </div>

      <div className="rc-body">
        {used.length > 0 && (
          <div className="rc-section">
            <span className="rc-section-head have"><CheckCircle2 size={10}/> You have</span>
            <div className="rc-tags">
              {used.slice(0,4).map((g,i) => <span key={i} className="rc-tag have">{g.name ?? g}</span>)}
              {used.length > 4 && <span className="rc-tag more">+{used.length - 4}</span>}
            </div>
          </div>
        )}
        {missed.length > 0 && (
          <div className="rc-section">
            <span className="rc-section-head miss"><XCircle size={10}/> Still need</span>
            <div className="rc-tags">
              {missed.slice(0,3).map((g,i) => <span key={i} className="rc-tag miss">{g.name ?? g}</span>)}
              {missed.length > 3 && <span className="rc-tag more">+{missed.length - 3}</span>}
            </div>
          </div>
        )}
        {total > 0 && (
          <div className="rc-bar-row">
            <div className="rc-bar">
              <div className="rc-bar-fill" style={{ width: `${pct}%`, background: fill }} />
            </div>
            <span className="rc-bar-txt">{used.length}/{total} ingredients</span>
          </div>
        )}
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────────────── */
function Skel({ i }) {
  return (
    <div className="rs-skel" style={{ "--d": `${i * 65}ms` }} aria-hidden="true">
      <div className="rs-skel-img" />
      <div className="rs-skel-body">
        <div className="rs-skel-line" style={{ height: 14, width: "82%" }} />
        <div className="rs-skel-line" style={{ height: 11, width: "58%" }} />
        <div className="rs-skel-line" style={{ height: 11, width: "40%" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   RECIPE DETAIL MODAL
───────────────────────────────────────────────────────────── */
function RecipeModal({ isOpen, onClose, recipe, loading }) {
  const [visible, setVisible]  = useState(false);
  const [closing, setClosing]  = useState(false);
  const closeTimer = useRef(null);

  // Mount when opened
  useEffect(() => {
    if (isOpen) { setClosing(false); setVisible(true); }
  }, [isOpen]);

  // Play exit animation then fully unmount
  const handleClose = useCallback(() => {
    setClosing(true);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setVisible(false);
      setClosing(false);
      onClose();
    }, 220);
  }, [onClose]);

  // Escape key
  useEffect(() => {
    if (!visible) return;
    const handler = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [visible, handleClose]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  if (!visible) return null;

  return (
    <div
      className={`rs-modal-overlay${closing ? " closing" : ""}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Recipe details"
    >
      <div className="rs-modal" onClick={e => e.stopPropagation()}>
        {loading ? (
          <div className="rs-modal-loader">
            <span className="spin"><Loader2 size={28} color="#9cb89e" /></span>
          </div>
        ) : recipe && (
          <>
            {/* Hero */}
            <div className="rs-modal-hero">
              {recipe.image && (
                <img src={recipe.image} alt={recipe.title} />
              )}
              <div className="rs-modal-hero-overlay" />
              <div className="rs-modal-title-layer">
                <h2>{recipe.title}</h2>
              </div>
              <button
                className="rs-modal-close"
                onClick={handleClose}
                aria-label="Close modal"
              >
                <X size={16} color="white" strokeWidth={2} />
              </button>
            </div>

            {/* Body */}
            <div className="rs-modal-body">
              {/* Stat pills */}
              <div className="rs-modal-pills">
                {recipe.readyInMinutes && (
                  <span className="rs-modal-pill">
                    <Clock size={14} strokeWidth={2} />
                    {recipe.readyInMinutes} mins
                  </span>
                )}
                {recipe.servings && (
                  <span className="rs-modal-pill">
                    <ChefHat size={14} strokeWidth={2} />
                    Serves {recipe.servings}
                  </span>
                )}
                {recipe.healthScore != null && (
                  <span className="rs-modal-pill green">
                    <CheckCircle size={14} strokeWidth={2} />
                    Health score: {recipe.healthScore}
                  </span>
                )}
              </div>

              {/* Instructions */}
              {recipe.instructions && (
                <>
                  <p className="rs-modal-section-label">Instructions</p>
                  <div className="rs-modal-steps">
                    {parseSteps(recipe.instructions).map((step, i) => (
                      <div key={i} className="rs-modal-step">
                        <span className="rs-modal-step-num">{i + 1}</span>
                        <p className="rs-modal-step-text">{step}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */
const PAGE_SIZE = 6;

export default function RecipeSection() {
  const [recipes,       setRecipes]       = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [loadingMore,   setLoadingMore]   = useState(false);
  const [error,         setError]         = useState(null);
  const [fetched,       setFetched]       = useState(false);
  const [hasMore,       setHasMore]       = useState(true);
  const [query,         setQuery]         = useState("");
  const [mode,          setMode]          = useState(null);
  const [offset,        setOffset]        = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen,   setIsModalOpen]   = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const lastCall = useRef(null);

  // Inject styles once
  useEffect(() => {
    if (document.getElementById("rs-css")) return;
    const s = document.createElement("style");
    s.id = "rs-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }, []);

  // ── Core fetch ─────────────────────────────────────────────
  const fetchRecipes = useCallback(async (isNewSearch, currentMode, currentQuery, currentOffset) => {
    lastCall.current = () => fetchRecipes(isNewSearch, currentMode, currentQuery, currentOffset);

    if (isNewSearch) {
      setLoading(true);
      setError(null);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const apiFn = currentMode === "SEARCH"
        ? () => recipeApi.searchByQuery(currentQuery, PAGE_SIZE, currentOffset)
        : () => recipeApi.getSuggestions(PAGE_SIZE, currentOffset);

      const { data } = await apiFn();
      const results = Array.isArray(data) ? data : [];

      if (isNewSearch) {
        setRecipes(results);
        setFetched(true);
        setOffset(PAGE_SIZE);
      } else {
        setRecipes(prev => [...prev, ...results]);
        setOffset(prev => prev + PAGE_SIZE);
      }

      if (results.length < PAGE_SIZE) setHasMore(false);

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // ── Public actions ─────────────────────────────────────────
  const handleSearch = useCallback((e) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q || loading) return;
    setMode("SEARCH");
    fetchRecipes(true, "SEARCH", q, 0);
  }, [query, loading, fetchRecipes]);

  const handleCardClick = useCallback(async (recipeId) => {
    setSelectedRecipe(null);
    setLoadingDetail(true);
    setIsModalOpen(true);
    try {
      const { data } = await recipeApi.getDetails(recipeId);
      setSelectedRecipe(data);
    } catch (err) {
      console.error("Recipe detail error:", err);
      setIsModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  }, []);

  const handlePantry = useCallback(() => {
    if (loading) return;
    setMode("SUGGEST");
    fetchRecipes(true, "SUGGEST", "", 0);
  }, [loading, fetchRecipes]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    fetchRecipes(false, mode, query, offset);
  }, [loadingMore, hasMore, mode, query, offset, fetchRecipes]);

  const retry = () => lastCall.current?.();

  const reset = () => {
    setFetched(false); setRecipes([]);
    setError(null); setMode(null);
    setQuery(""); setOffset(0); setHasMore(true);
  };

  const slim = fetched || loading || !!error;

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="rs">

      {/* ── HERO ── */}
      <div className={`rs-hero${slim ? " slim" : ""}`}>
        {!slim && <div className="rs-deco" aria-hidden="true">🍽</div>}

        <div className="rs-hero-inner">
          <div className="rs-hero-text">
            {!slim && <div className="rs-tag"><Salad size={11} /> Recipe Discovery</div>}
            <h1>
              {slim
                ? <><ChefHat size={17} strokeWidth={1.8} style={{verticalAlign:"middle",marginRight:8}}/>Recipe Discovery</>
                : <>Find something<br /><em>delicious</em> to cook</>
              }
            </h1>
            {!slim && (
              <p className="rs-hero-sub">
                Search millions of global recipes by keyword, or let your pantry
                ingredients guide tonight's meal.
              </p>
            )}
          </div>

          <div className="rs-controls">
            <div className="rs-field">
              <Search size={15} className="rs-field-icon" />
              <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", minWidth: 0 }}>
                <input
                  placeholder="Search by keyword… Pasta, Tacos"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  aria-label="Search recipes by keyword"
                />
              </form>
              {query && (
                <button className="rs-field-x" type="button" onClick={() => setQuery("")} aria-label="Clear search">
                  <X size={12} />
                </button>
              )}
              <button
                className="rs-search-btn"
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                aria-label="Search recipes"
              >
                {loading && mode === "SEARCH"
                  ? <span className="spin" aria-hidden="true"><Loader2 size={13} /></span>
                  : <><Search size={13} /> Search</>
                }
              </button>
            </div>

            {!slim && <div className="rs-divider" aria-hidden="true">or use your pantry</div>}

            <button
              className="rs-pantry-btn"
              onClick={handlePantry}
              disabled={loading}
              aria-label="Find recipes based on pantry ingredients"
            >
              {loading && mode === "SUGGEST"
                ? <span className="spin" aria-hidden="true"><Loader2 size={15} /></span>
                : <Sparkles size={15} aria-hidden="true" />
              }
              {slim ? "From My Pantry" : "Find Recipes from My Pantry"}
              {!slim && <ArrowRight size={13} style={{ marginLeft: "auto" }} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── HINT CARDS (pre-fetch only) ── */}
      {!slim && (
        <div className="rs-hints" aria-hidden="true">
          {[
            { icon: "🥗", bg: "hsl(120,30%,93%)", title: "Match Your Pantry",  desc: "Find recipes using ingredients you already have at home." },
            { icon: "🔍", bg: "hsl(140,28%,92%)", title: "Search Any Dish",    desc: 'Type a keyword like "pasta" or "soup" to explore millions of recipes.' },
            { icon: "📊", bg: "hsl(160,26%,91%)", title: "See Your Coverage",   desc: "Each card shows exactly how many ingredients you have vs. still need." },
          ].map((h, i) => (
            <div key={i} className="rs-hint">
              <div className="rs-hint-icon" style={{ background: h.bg }}>{h.icon}</div>
              <div className="rs-hint-title">{h.title}</div>
              <div className="rs-hint-desc">{h.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── CONTENT ── */}
      <div className="rs-content">

        {slim && (
          <div className="rs-bar">
            <div className="rs-bar-left">
              {fetched && (
                <>
                  <span className="rs-bar-count">{recipes.length}</span>
                  <span className="rs-bar-label">
                    recipe{recipes.length !== 1 ? "s" : ""} loaded
                    {mode === "SEARCH" && query && <> for <em>"{query}"</em></>}
                    {mode === "SUGGEST" && <> from your pantry</>}
                  </span>
                </>
              )}
              {loading && !fetched && <span className="rs-bar-label">Searching…</span>}
            </div>
            <button className="rs-new-btn" onClick={reset} aria-label="Start a new search">
              <X size={12} /> New search
            </button>
          </div>
        )}

        {loading && !fetched && (
          <div className="rs-grid" aria-busy="true" aria-label="Loading recipes">
            {[...Array(PAGE_SIZE)].map((_, i) => <Skel key={i} i={i} />)}
          </div>
        )}

        {!loading && error && (
          <div className="rs-err" role="alert">
            <h3>Couldn't load recipes</h3>
            <p>{error}</p>
            <button className="rs-retry" onClick={retry}>Try again</button>
          </div>
        )}

        {!loading && fetched && !error && recipes.length === 0 && (
          <div className="rs-empty" role="status">
            <div className="rs-empty-icon"><ChefHat size={26} strokeWidth={1.3} /></div>
            <h3>No recipes found</h3>
            <p>Try a different keyword, or add more items to your pantry for better matches.</p>
          </div>
        )}

        {fetched && !error && recipes.length > 0 && (
          <div className="rs-grid" role="list" aria-label="Recipe results">
            {recipes.map((r) => (
              <div key={r.id} onClick={() => handleCardClick(r.id)}>
                <RecipeCard recipe={r} />
              </div>
            ))}
          </div>
        )}

        {fetched && !error && recipes.length > 0 && hasMore && (
          <div style={{ display:"flex", justifyContent:"center", marginTop: 32 }}>
            <button
              className="rs-load-more-btn"
              onClick={handleLoadMore}
              disabled={loadingMore}
              aria-label="Load more recipes"
            >
              {loadingMore
                ? <><span className="spin" aria-hidden="true"><Loader2 size={16} /></span> Loading…</>
                : "Show More Recipes"
              }
            </button>
          </div>
        )}

        {fetched && !error && recipes.length > 0 && !hasMore && (
          <p style={{ textAlign:"center", marginTop:28, fontSize:13, color:"var(--ink3)", paddingBottom:8 }}>
            — All {recipes.length} recipes loaded —
          </p>
        )}

      </div>

      {/* ── MODAL — rendered outside rs-content to avoid stacking context issues ── */}
      <RecipeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recipe={selectedRecipe}
        loading={loadingDetail}
      />

    </div>
  );
}