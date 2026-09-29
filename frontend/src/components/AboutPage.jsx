import { Leaf, Target, Heart, Zap } from "lucide-react";

const VALUES = [
  { icon: Target, color: "#2e7d32", bg: "#f0f7f0", title: "Zero Waste Mission", desc: "We believe food waste is one of the most solvable problems on earth. Smart Pantry exists to make waste-free cooking effortless." },
  { icon: Heart,  color: "#c62828", bg: "#ffebee", title: "Built with Care",    desc: "Every feature is designed with real home cooks in mind — practical, fast, and genuinely useful in the daily kitchen routine." },
  { icon: Zap,    color: "#e65100", bg: "#fff3e0", title: "Always Improving",   desc: "We ship updates constantly. If something can be smarter or simpler, we'll make it so. Your feedback drives our roadmap." },
];

export default function AboutPage() {
  return (
    <>
      <style>{ABOUT_CSS}</style>
      <div className="ab">

        {/* Hero */}
        <section className="ab-hero">
          <div className="ab-hero__deco" aria-hidden="true" />
          <div className="ab-hero__inner">
            <div className="ab-tag"><Leaf size={11} /> Our Story</div>
            <h1 className="ab-title">We're on a mission to<br /><em>end food waste</em></h1>
            <p className="ab-sub">
              Smart Pantry started as a simple question: <strong>why do we keep throwing out food?</strong>
              The answer was always the same — we forgot what we had, or we didn't know what to cook with it.
              So we built the tool we wished existed.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="ab-stats">
          <div className="ab-stats__inner">
            {[
              { value: "1/3", label: "of all food produced is wasted globally every year" },
              { value: "$1.3T", label: "worth of food is lost or wasted annually worldwide" },
              { value: "8%",  label: "of global greenhouse gas emissions come from food waste" },
            ].map(({ value, label }) => (
              <div key={value} className="ab-stat">
                <div className="ab-stat__value">{value}</div>
                <div className="ab-stat__label">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="ab-values">
          <div className="ab-values__inner">
            <div className="ab-section-label">What we believe</div>
            <h2 className="ab-section-title">Our values</h2>
            <div className="ab-values__grid">
              {VALUES.map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className="ab-value">
                  <div className="ab-value__icon" style={{ background: bg }}>
                    <Icon size={22} color={color} strokeWidth={1.8} />
                  </div>
                  <h3 className="ab-value__title">{title}</h3>
                  <p className="ab-value__desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="ab-story">
          <div className="ab-story__inner">
            <div className="ab-section-label">The backstory</div>
            <h2 className="ab-section-title">How it all began</h2>
            <div className="ab-story__body">
              <p>
                Smart Pantry was born out of frustration. Our founder came home one evening to find a wilted
                bag of spinach, a half-used block of feta, and three eggs — and absolutely no idea what to
                make with them. A quick internet search returned hundreds of recipes, but none that matched
                exactly what was on hand.
              </p>
              <p>
                That night, the idea took shape: a tool that knows your pantry as well as you do, and connects
                it directly to the world's recipe knowledge. Not a general-purpose app, but a focused,
                intelligent assistant for the specific problem of "what can I cook right now?"
              </p>
              <p>
                Today, Smart Pantry helps home cooks track their ingredients, reduce waste, and discover
                great meals — using exactly what they already have. We're just getting started.
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

const ABOUT_CSS = `
.ab { background: var(--f50); }

.ab-hero {
  padding: clamp(60px,8vw,100px) clamp(20px,6vw,80px);
  position: relative; overflow: hidden;
  background: linear-gradient(to bottom, #fff, var(--f50));
  border-bottom: 1px solid var(--f100);
}
.ab-hero__deco {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 60% 70% at 80% 50%, rgba(46,125,50,.06), transparent);
}
.ab-hero__inner { max-width: 700px; position: relative; z-index: 1; }
.ab-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  color: var(--f500); background: rgba(46,125,50,.08); border: 1px solid rgba(46,125,50,.15);
  border-radius: 99px; padding: 6px 14px; margin-bottom: 20px;
}
.ab-title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(32px,4.5vw,60px); color: var(--f900);
  line-height: 1.1; letter-spacing: -.4px; margin-bottom: 20px;
}
.ab-title em { color: var(--f500); font-style: italic; }
.ab-sub { font-size: clamp(15px,1.5vw,18px); color: var(--f600); line-height: 1.7; max-width: 560px; }
.ab-sub strong { color: var(--f700); }

.ab-stats { background: var(--f700); padding: clamp(40px,6vw,64px) clamp(20px,6vw,80px); }
.ab-stats__inner { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 32px; }
.ab-stat__value { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(32px,4vw,52px); color: #fff; margin-bottom: 8px; }
.ab-stat__label { font-size: 14px; color: rgba(255,255,255,.65); line-height: 1.5; }

.ab-values { padding: clamp(56px,7vw,88px) clamp(20px,6vw,80px); background: #fff; }
.ab-values__inner { max-width: 1000px; margin: 0 auto; }
.ab-section-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--f500); margin-bottom: 10px; }
.ab-section-title { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(26px,3.5vw,42px); color: var(--f900); margin-bottom: 40px; }
.ab-values__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 20px; }
.ab-value { background: var(--f50); border-radius: 16px; border: 1px solid var(--f100); padding: 24px; }
.ab-value__icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.ab-value__title { font-family: 'DM Serif Display', Georgia, serif; font-size: 18px; color: var(--f800); margin-bottom: 8px; }
.ab-value__desc { font-size: 14px; color: var(--f600); line-height: 1.65; }

.ab-story { padding: clamp(56px,7vw,88px) clamp(20px,6vw,80px); }
.ab-story__inner { max-width: 700px; }
.ab-story__body { display: flex; flex-direction: column; gap: 18px; }
.ab-story__body p { font-size: clamp(14px,1.2vw,16px); color: var(--f600); line-height: 1.8; }
`;