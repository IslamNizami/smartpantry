import { Leaf, Package, ChefHat, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

const FEATURES = [
  {
    icon: Package,
    color: "#2e7d32",
    bg: "#f0f7f0",
    title: "Smart Pantry Tracking",
    desc: "Track every ingredient you own, get alerts before things expire, and always know exactly what's in your kitchen.",
  },
  {
    icon: ChefHat,
    color: "#1565c0",
    bg: "#e3f2fd",
    title: "AI Recipe Discovery",
    desc: "Enter your pantry ingredients and instantly discover recipes you can make tonight — no extra shopping required.",
  },
  {
    icon: ShieldCheck,
    color: "#6a1b9a",
    bg: "#f3e5f5",
    title: "Zero Food Waste",
    desc: "Expiry tracking and smart suggestions mean you'll never throw out food again. Save money, help the planet.",
  },
  {
    icon: Sparkles,
    color: "#e65100",
    bg: "#fff3e0",
    title: "Intelligent Suggestions",
    desc: "The more you use it, the smarter it gets. Personalized recipe matches based on what you actually have.",
  },
];

const STEPS = [
  { num: "01", title: "Create your account", desc: "Sign up in seconds — no credit card required." },
  { num: "02", title: "Add your ingredients", desc: "Scan or manually add what's in your fridge and cupboards." },
  { num: "03", title: "Discover recipes", desc: "Get matched with dishes you can make right now." },
];

export default function LandingPage({ onGetStarted, onNavigate }) {
  return (
    <>
      <style>{LANDING_CSS}</style>
      <div className="lp">

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero__deco" aria-hidden="true">
            <div className="lp-hero__orb lp-hero__orb--1" />
            <div className="lp-hero__orb lp-hero__orb--2" />
            <div className="lp-hero__grid" />
          </div>

          <div className="lp-hero__inner">
            <div className="lp-hero__tag">
              <Leaf size={11} />
              Zero Food Waste Kitchen
            </div>

            <h1 className="lp-hero__title">
              Your kitchen,<br />
              <em>intelligently</em> managed.
            </h1>

            <p className="lp-hero__sub">
              Smart Pantry tracks your ingredients, warns you before they expire,
              and finds recipes you can cook <strong>right now</strong> — using exactly what you already have.
            </p>

            <div className="lp-hero__actions">
              <button className="lp-btn lp-btn--primary" onClick={onGetStarted}>
                Get Started Free <ArrowRight size={16} />
              </button>
              <button className="lp-btn lp-btn--ghost" onClick={() => onNavigate("recipes")}>
                Browse Recipes
              </button>
            </div>

            <div className="lp-hero__proof">
              {["No credit card", "Free forever plan", "2-minute setup"].map(t => (
                <span key={t} className="lp-hero__proof-item">
                  <CheckCircle2 size={13} /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Floating cards */}
          <div className="lp-hero__cards" aria-hidden="true">
            <div className="lp-card lp-card--pantry">
              <div className="lp-card__head">
                <Package size={14} color="var(--f500)" />
                <span>Pantry — 12 items</span>
              </div>
              <div className="lp-card__row lp-card__row--warn">🥛 Milk · expires in 2 days</div>
              <div className="lp-card__row">🥚 Eggs · 6 pcs · fresh</div>
              <div className="lp-card__row">🧀 Cheddar · 200g · fresh</div>
            </div>
            <div className="lp-card lp-card--recipe">
              <div className="lp-card__head">
                <ChefHat size={14} color="#1565c0" />
                <span>Suggested recipe</span>
              </div>
              <div className="lp-card__recipe-name">Cheese Omelette</div>
              <div className="lp-card__match">
                <div className="lp-card__bar"><div className="lp-card__bar-fill" style={{ width: "83%" }} /></div>
                <span>83% match</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="lp-section lp-features">
          <div className="lp-section__inner">
            <div className="lp-section__label">Features</div>
            <h2 className="lp-section__title">Everything your kitchen needs</h2>
            <p className="lp-section__sub">A complete toolkit to reduce waste, save money, and cook smarter every day.</p>

            <div className="lp-features__grid">
              {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className="lp-feat">
                  <div className="lp-feat__icon" style={{ background: bg }}>
                    <Icon size={22} color={color} strokeWidth={1.8} />
                  </div>
                  <h3 className="lp-feat__title">{title}</h3>
                  <p className="lp-feat__desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="lp-section lp-how" style={{ background: "#fff" }}>
          <div className="lp-section__inner">
            <div className="lp-section__label">How it works</div>
            <h2 className="lp-section__title">Up and running in 2 minutes</h2>

            <div className="lp-how__steps">
              {STEPS.map(({ num, title, desc }) => (
                <div key={num} className="lp-step">
                  <div className="lp-step__num">{num}</div>
                  <h3 className="lp-step__title">{title}</h3>
                  <p className="lp-step__desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="lp-cta">
          <div className="lp-cta__inner">
            <div className="lp-cta__icon"><Leaf size={28} color="#fff" strokeWidth={2} /></div>
            <h2 className="lp-cta__title">Ready to take control of your kitchen?</h2>
            <p className="lp-cta__sub">Join thousands of home cooks who waste less and cook more.</p>
            <button className="lp-btn lp-btn--white" onClick={onGetStarted}>
              Start for Free <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="lp-footer__inner">
            <div className="lp-footer__logo">
              <div className="lp-footer__logo-icon"><Leaf size={14} color="#fff" /></div>
              <span>SmartPantry</span>
            </div>
            <div className="lp-footer__links">
              <button onClick={() => onNavigate("about")}>About</button>
              <button onClick={() => onNavigate("contact")}>Contact</button>
              <button onClick={() => onNavigate("recipes")}>Recipes</button>
            </div>
            <div className="lp-footer__copy">© {new Date().getFullYear()} SmartPantry. Built with 💚</div>
          </div>
        </footer>

      </div>
    </>
  );
}

const LANDING_CSS = `
.lp { background: var(--f50); }

/* ── HERO ── */
.lp-hero {
  min-height: calc(100vh - 64px);
  display: flex; align-items: center;
  padding: clamp(48px,8vw,100px) clamp(20px,6vw,80px);
  gap: clamp(32px,5vw,72px);
  position: relative; overflow: hidden;
  flex-wrap: wrap;
}
.lp-hero__deco { position: absolute; inset: 0; pointer-events: none; }
.lp-hero__orb {
  position: absolute; border-radius: 50%;
  filter: blur(80px); opacity: .45;
}
.lp-hero__orb--1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(46,125,50,.15), transparent 70%);
  top: -100px; left: -120px;
}
.lp-hero__orb--2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(77,161,85,.1), transparent 70%);
  bottom: -80px; right: -80px;
}
.lp-hero__grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(46,125,50,.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(46,125,50,.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

.lp-hero__inner { flex: 1 1 400px; max-width: 580px; position: relative; z-index: 1; }
.lp-hero__tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  color: var(--f500); background: rgba(46,125,50,.09); border-radius: 99px;
  padding: 6px 14px; margin-bottom: 20px;
  border: 1px solid rgba(46,125,50,.15);
}
.lp-hero__title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(36px,5vw,68px); font-weight: 400;
  color: var(--f900); line-height: 1.08; letter-spacing: -.5px;
  margin-bottom: 20px;
}
.lp-hero__title em { color: var(--f500); font-style: italic; }
.lp-hero__sub {
  font-size: clamp(15px,1.5vw,18px); color: var(--f600);
  line-height: 1.7; max-width: 460px; margin-bottom: 32px;
}
.lp-hero__sub strong { color: var(--f700); }

.lp-hero__actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
.lp-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 24px; border-radius: 10px;
  font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
  cursor: pointer; border: none; transition: all .18s; white-space: nowrap;
}
.lp-btn--primary {
  background: var(--f500); color: #fff;
  box-shadow: 0 4px 20px rgba(46,125,50,.35);
}
.lp-btn--primary:hover { background: var(--f600); transform: translateY(-1px); box-shadow: 0 6px 28px rgba(46,125,50,.4); }
.lp-btn--ghost {
  background: #fff; color: var(--f600);
  border: 1.5px solid var(--f200);
}
.lp-btn--ghost:hover { background: var(--f50); border-color: var(--f400); }
.lp-btn--white {
  background: #fff; color: var(--f600);
  box-shadow: 0 4px 20px rgba(0,0,0,.1);
}
.lp-btn--white:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,0,0,.14); }

.lp-hero__proof { display: flex; flex-wrap: wrap; gap: 16px; }
.lp-hero__proof-item {
  display: flex; align-items: center; gap: 5px;
  font-size: 12.5px; color: var(--f500); font-weight: 500;
}

/* floating cards */
.lp-hero__cards {
  flex: 0 0 auto; display: flex; flex-direction: column; gap: 14px;
  position: relative; z-index: 1; max-width: 280px; width: 100%;
  animation: lp-float 5s ease-in-out infinite;
}
@keyframes lp-float {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-10px); }
}
.lp-card {
  background: #fff; border-radius: 14px;
  border: 1px solid var(--f100); padding: 14px 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,.08);
  display: flex; flex-direction: column; gap: 10px;
}
.lp-card--recipe { background: #f8faff; border-color: #cfe2ff; }
.lp-card__head {
  display: flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 700; color: var(--f600); text-transform: uppercase; letter-spacing: .08em;
}
.lp-card--recipe .lp-card__head { color: #1565c0; }
.lp-card__row { font-size: 13px; color: var(--f700); padding: 4px 0; border-bottom: 1px solid var(--f50); }
.lp-card__row:last-child { border-bottom: none; }
.lp-card__row--warn { color: #b45309; background: #fffbeb; border-radius: 6px; padding: 4px 8px; border: 1px solid #fde68a; font-weight: 500; }
.lp-card__recipe-name { font-family: 'DM Serif Display', Georgia, serif; font-size: 18px; color: #1a237e; }
.lp-card__match { display: flex; align-items: center; gap: 10px; }
.lp-card__bar { flex: 1; height: 5px; background: #e3f2fd; border-radius: 5px; overflow: hidden; }
.lp-card__bar-fill { height: 100%; background: #1565c0; border-radius: 5px; }
.lp-card__match span { font-size: 12px; font-weight: 700; color: #1565c0; white-space: nowrap; }

@media (max-width: 860px) { .lp-hero__cards { display: none; } }

/* ── SECTIONS ── */
.lp-section { padding: clamp(56px,8vw,96px) clamp(20px,6vw,80px); }
.lp-section__inner { max-width: 1100px; margin: 0 auto; }
.lp-section__label {
  font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
  color: var(--f500); margin-bottom: 12px;
}
.lp-section__title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(26px,3.5vw,44px); color: var(--f900);
  margin-bottom: 12px; line-height: 1.15;
}
.lp-section__sub { font-size: 16px; color: var(--f600); max-width: 500px; line-height: 1.65; margin-bottom: 48px; }

/* ── FEATURES GRID ── */
.lp-features__grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 20px;
}
.lp-feat {
  background: #fff; border-radius: 16px;
  border: 1px solid var(--f100); padding: 24px;
  transition: transform .2s, box-shadow .2s;
}
.lp-feat:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,.07); }
.lp-feat__icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.lp-feat__title { font-family: 'DM Serif Display', Georgia, serif; font-size: 18px; color: var(--f800); margin-bottom: 8px; }
.lp-feat__desc { font-size: 14px; color: var(--f600); line-height: 1.65; }

/* ── HOW STEPS ── */
.lp-how { background: #fff; }
.lp-how__steps { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap: 32px; }
.lp-step__num {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 42px; color: var(--f200); line-height: 1; margin-bottom: 12px;
}
.lp-step__title { font-size: 18px; font-weight: 600; color: var(--f800); margin-bottom: 8px; }
.lp-step__desc { font-size: 14px; color: var(--f500); line-height: 1.65; }

/* ── CTA ── */
.lp-cta {
  background: linear-gradient(135deg, var(--f700), var(--f500));
  padding: clamp(56px,8vw,96px) clamp(20px,6vw,80px);
}
.lp-cta__inner { max-width: 560px; margin: 0 auto; text-align: center; }
.lp-cta__icon {
  width: 60px; height: 60px; border-radius: 16px;
  background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
}
.lp-cta__title { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(24px,3vw,38px); color: #fff; margin-bottom: 12px; }
.lp-cta__sub { font-size: 15px; color: rgba(255,255,255,.8); margin-bottom: 28px; line-height: 1.6; }

/* ── FOOTER ── */
.lp-footer { background: var(--f800); padding: 28px clamp(20px,6vw,80px); }
.lp-footer__inner {
  max-width: 1100px; margin: 0 auto;
  display: flex; align-items: center; flex-wrap: wrap; gap: 16px;
}
.lp-footer__logo { display: flex; align-items: center; gap: 8px; }
.lp-footer__logo-icon {
  width: 26px; height: 26px; border-radius: 7px; background: var(--f500);
  display: flex; align-items: center; justify-content: center;
}
.lp-footer__logo span { font-family: 'DM Serif Display', Georgia, serif; font-size: 15px; color: #fff; }
.lp-footer__links { display: flex; gap: 4px; flex: 1; justify-content: center; flex-wrap: wrap; }
.lp-footer__links button {
  background: none; border: none; cursor: pointer;
  font-size: 13px; color: rgba(255,255,255,.55); padding: 6px 10px; border-radius: 6px;
  font-family: 'DM Sans', sans-serif; transition: color .12s;
}
.lp-footer__links button:hover { color: #fff; }
.lp-footer__copy { font-size: 12px; color: rgba(255,255,255,.35); white-space: nowrap; }
`;