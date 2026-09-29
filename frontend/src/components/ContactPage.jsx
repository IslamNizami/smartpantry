import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const [form,    setForm]    = useState({ name: "", email: "", subject: "", message: "" });
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Simulate send (no real backend endpoint for contact yet)
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <>
      <style>{CONTACT_CSS}</style>
      <div className="ct">

        {/* Hero */}
        <section className="ct-hero">
          <div className="ct-hero__inner">
            <div className="ct-tag"><MessageSquare size={11} /> Get in Touch</div>
            <h1 className="ct-title">We'd love to hear<br /><em>from you</em></h1>
            <p className="ct-sub">
              Have a question, feature request, or just want to say hi?
              Drop us a message and we'll get back to you within 24 hours.
            </p>
          </div>
        </section>

        <section className="ct-body">
          <div className="ct-body__inner">

            {/* Info panel */}
            <div className="ct-info">
              <h2 className="ct-info__title">Contact info</h2>
              {[
                { icon: Mail,    label: "Email us",      value: "hello@smartpantry.app" },
                { icon: MapPin,  label: "Based in",      value: "Budapest, Hungary 🇭🇺" },
                { icon: Clock,   label: "Response time", value: "Within 24 hours" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="ct-info__item">
                  <div className="ct-info__icon"><Icon size={16} color="var(--f500)" strokeWidth={2} /></div>
                  <div>
                    <div className="ct-info__item-label">{label}</div>
                    <div className="ct-info__item-value">{value}</div>
                  </div>
                </div>
              ))}

              <div className="ct-info__note">
                For bug reports or technical issues, please include your browser version and a description
                of what happened — it helps us fix things faster!
              </div>
            </div>

            {/* Form */}
            <div className="ct-form-card">
              {sent ? (
                <div className="ct-sent">
                  <div className="ct-sent__icon"><CheckCircle size={32} color="var(--f500)" /></div>
                  <h3>Message sent!</h3>
                  <p>Thanks for reaching out. We'll reply to <strong>{form.email}</strong> within 24 hours.</p>
                  <button className="btn-ghost" onClick={() => { setSent(false); setForm({ name:"",email:"",subject:"",message:"" }); }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h2 className="ct-form__title">Send a message</h2>

                  <div className="form-grid" style={{ marginBottom: 16 }}>
                    <div>
                      <label className="form-label">Your Name</label>
                      <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Jane Smith" required />
                    </div>
                    <div>
                      <label className="form-label">Email Address</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="jane@example.com" required />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} className="input-field" placeholder="Feature request / Bug report / General question…" />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label className="form-label">Message</label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange}
                      className="input-field ct-textarea"
                      placeholder="Tell us what's on your mind…"
                      rows={5} required
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                    {loading
                      ? <span className="animate-spin" style={{ display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%" }} />
                      : <><Send size={15} /> Send Message</>
                    }
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </div>
    </>
  );
}

const CONTACT_CSS = `
.ct { background: var(--f50); }

.ct-hero {
  padding: clamp(60px,8vw,100px) clamp(20px,6vw,80px) clamp(40px,5vw,60px);
  background: linear-gradient(to bottom, #fff, var(--f50));
  border-bottom: 1px solid var(--f100);
}
.ct-hero__inner { max-width: 600px; }
.ct-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  color: var(--f500); background: rgba(46,125,50,.08); border: 1px solid rgba(46,125,50,.15);
  border-radius: 99px; padding: 6px 14px; margin-bottom: 20px;
}
.ct-title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(32px,4.5vw,58px); color: var(--f900);
  line-height: 1.1; letter-spacing: -.4px; margin-bottom: 18px;
}
.ct-title em { color: var(--f500); font-style: italic; }
.ct-sub { font-size: clamp(15px,1.4vw,17px); color: var(--f600); line-height: 1.7; max-width: 500px; }

.ct-body { padding: clamp(40px,6vw,72px) clamp(20px,6vw,80px); }
.ct-body__inner {
  max-width: 1000px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 2fr; gap: 40px;
}
@media (max-width: 700px) { .ct-body__inner { grid-template-columns: 1fr; } }

.ct-info { display: flex; flex-direction: column; gap: 20px; }
.ct-info__title { font-family: 'DM Serif Display', Georgia, serif; font-size: 22px; color: var(--f800); }
.ct-info__item { display: flex; align-items: flex-start; gap: 12px; }
.ct-info__icon {
  width: 36px; height: 36px; border-radius: 9px; background: var(--f100);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;
}
.ct-info__item-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--f400); margin-bottom: 2px; }
.ct-info__item-value { font-size: 14px; color: var(--f700); font-weight: 500; }
.ct-info__note {
  font-size: 13px; color: var(--f500); line-height: 1.65;
  background: var(--f100); border-radius: 10px; padding: 14px;
  border-left: 3px solid var(--f400);
}

.ct-form-card {
  background: #fff; border-radius: 20px;
  border: 1px solid var(--f100); padding: 32px;
  box-shadow: var(--shadow-lift);
}
.ct-form__title { font-family: 'DM Serif Display', Georgia, serif; font-size: 22px; color: var(--f800); margin-bottom: 24px; }
.ct-textarea { resize: vertical; min-height: 120px; line-height: 1.6; }

.ct-sent {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; text-align: center;
  padding: 40px 20px; gap: 12px; min-height: 280px;
}
.ct-sent__icon {
  width: 64px; height: 64px; border-radius: 50%; background: var(--f100);
  display: flex; align-items: center; justify-content: center; margin-bottom: 8px;
}
.ct-sent h3 { font-family: 'DM Serif Display', Georgia, serif; font-size: 24px; color: var(--f800); }
.ct-sent p  { font-size: 14px; color: var(--f500); line-height: 1.6; max-width: 320px; }
`;