import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Users, ShoppingBag, Radio, Zap, ChevronRight, Star, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─── Floating particle ─────────────────────────────────────────────── */
function Particle({ style }) {
  return <div className="lp-particle" style={style} />;
}

/* ─── Animated counter ─────────────────────────────────────────────── */
function Counter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ─── Feature Card ──────────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, color, delay }) {
  return (
    <div className="lp-feature-card" style={{ animationDelay: delay }}>
      <div className="lp-feature-icon" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <Icon size={22} color={color} />
      </div>
      <h3 className="lp-feature-title">{title}</h3>
      <p className="lp-feature-desc">{desc}</p>
    </div>
  );
}

/* ─── Mock WhatsApp chat bubble ─────────────────────────────────────── */
function ChatBubble({ msg, from, delay, color }) {
  return (
    <div
      className="lp-chat-bubble"
      style={{
        alignSelf: from === 'me' ? 'flex-end' : 'flex-start',
        background: from === 'me' ? 'var(--green)' : 'var(--bg-hover)',
        color: from === 'me' ? '#000' : 'var(--text-primary)',
        animationDelay: delay,
      }}
    >
      {msg}
    </div>
  );
}

/* ─── Landing Page ──────────────────────────────────────────────────── */
export default function LandingPage() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger entrance animations
    setTimeout(() => setVisible(true), 50);
  }, []);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    width:  `${Math.random() * 6 + 2}px`,
    height: `${Math.random() * 6 + 2}px`,
    left:   `${Math.random() * 100}%`,
    top:    `${Math.random() * 100}%`,
    background: i % 3 === 0 ? 'var(--green)' : i % 3 === 1 ? 'var(--blue)' : 'var(--amber)',
    opacity: Math.random() * 0.5 + 0.1,
    animationDuration: `${Math.random() * 6 + 4}s`,
    animationDelay: `${Math.random() * 4}s`,
    borderRadius: '50%',
  }));

  return (
    <div className="lp-root">
      {/* Animated background grid */}
      <div className="lp-grid-bg" />

      {/* Glow orbs */}
      <div className="lp-orb lp-orb-1" />
      <div className="lp-orb lp-orb-2" />
      <div className="lp-orb lp-orb-3" />

      {/* Floating particles */}
      {particles.map((p, i) => <Particle key={i} style={p} />)}

      {/* ── NAV ── */}
      <nav className={`lp-nav ${visible ? 'lp-nav--visible' : ''}`}>
        <div className="lp-nav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="lp-logo-icon">
              <MessageCircle size={20} color="#000" fill="#000" />
            </div>
            <span className="lp-logo-text">Client<span>Flow</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Made for Nigerian businesses 🇳🇬</span>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
              Login <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className={`lp-hero-badge ${visible ? 'lp-anim-in' : ''}`} style={{ animationDelay: '0.1s' }}>
          <span className="lp-badge-dot" />
          <span>🇳🇬 Built for Nigerian WhatsApp Sellers</span>
        </div>

        <h1 className={`lp-hero-title ${visible ? 'lp-anim-in' : ''}`} style={{ animationDelay: '0.25s' }}>
          Run your business like a <br />
          <span className="lp-gradient-text">professional</span>
          <span className="lp-cursor" />
        </h1>

        <p className={`lp-hero-sub ${visible ? 'lp-anim-in' : ''}`} style={{ animationDelay: '0.4s' }}>
          ClientFlow helps you manage customers, track orders, and reply faster on WhatsApp —
          all in one place. No more lost messages. No more confusion.
        </p>

        <div className={`lp-hero-actions ${visible ? 'lp-anim-in' : ''}`} style={{ animationDelay: '0.55s' }}>
          <button className="lp-cta-btn" onClick={() => navigate('/signup')}>
            <span>Start for Free</span>
            <ArrowRight size={18} />
            <div className="lp-cta-shine" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Check size={14} color="var(--green)" />
            No credit card · Free forever plan
          </div>
        </div>

        {/* Stars */}
        <div className={`lp-stars ${visible ? 'lp-anim-in' : ''}`} style={{ animationDelay: '0.7s' }}>
          {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="var(--amber)" color="var(--amber)" />)}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: 6 }}>
            Loved by 500+ Nigerian vendors
          </span>
        </div>
      </section>

      {/* ── MOCK APP PREVIEW ── */}
      <div className={`lp-preview-wrap ${visible ? 'lp-anim-in' : ''}`} style={{ animationDelay: '0.5s' }}>
        {/* Chat demo */}
        <div className="lp-preview-card lp-chat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
            <div className="avatar" style={{ background: 'linear-gradient(135deg,var(--green),#0e8a3e)' }}>C</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Chidera Okafor</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--green)' }}>● online</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className="badge badge-vip">🟡 VIP</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ChatBubble msg="Hello! I want to order 5 flyers 🙏" from="them" delay="0.8s" />
            <ChatBubble msg="Great choice! ✅ Your order is confirmed. Total: ₦15,000" from="me" delay="1.2s" />
            <ChatBubble msg="Your order is ready for pickup! 🎉" from="me" delay="1.6s" />
          </div>
        </div>

        {/* Stats mini card */}
        <div className="lp-preview-card lp-stats-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 12 }}>TODAY'S OVERVIEW</div>
          {[
            { label: 'New Orders', val: '4', color: 'var(--amber)' },
            { label: 'Revenue',    val: '₦48,000', color: 'var(--green)' },
            { label: 'Customers',  val: '12', color: 'var(--blue)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '8px 10px', background: 'var(--bg-hover)', borderRadius: 8 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.label}</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: s.color }}>{s.val}</span>
            </div>
          ))}
          <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'var(--green)', opacity: 0.8 }} />
            <div style={{ flex: 0.6, height: 4, borderRadius: 99, background: 'var(--amber)', opacity: 0.7 }} />
            <div style={{ flex: 0.4, height: 4, borderRadius: 99, background: 'var(--blue)', opacity: 0.6 }} />
          </div>
        </div>

        {/* Quick reply card */}
        <div className="lp-preview-card lp-reply-card">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 10 }}>QUICK REPLIES</div>
          {['Greeting 👋', 'Order Confirmed ✅', 'Payment Reminder 💰'].map(r => (
            <div key={r} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '7px 10px', background: 'var(--bg-hover)', borderRadius: 8, marginBottom: 6, cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s' }}>
              {r}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div className="lp-stats-strip">
        {[
          { val: 500,  suffix: '+', label: 'Active Users', prefix: '' },
          { val: 12000, suffix: '+', label: 'Orders Tracked', prefix: '' },
          { val: 1,    suffix: 'B+', label: 'In Revenue Managed', prefix: '₦' },
          { val: 98,   suffix: '%', label: 'Satisfaction Rate', prefix: '' },
        ].map(s => (
          <div key={s.label} className="lp-stat-item">
            <div className="lp-stat-val">
              <Counter target={s.val} suffix={s.suffix} prefix={s.prefix} />
            </div>
            <div className="lp-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section className="lp-section">
        <div className="lp-section-label">Everything you need</div>
        <h2 className="lp-section-title">
          Manage your WhatsApp business <br />
          <span className="lp-gradient-text">the smart way</span>
        </h2>

        <div className="lp-features-grid">
          <FeatureCard
            icon={Users}
            title="Customer Management"
            desc="Save customer names, numbers and tag them as New, Returning, or VIP. Never forget who you're talking to."
            color="var(--green)"
            delay="0s"
          />
          <FeatureCard
            icon={ShoppingBag}
            title="Order Tracking"
            desc="Track every order from Pending to Paid to Delivered. Know exactly what's happening with each job."
            color="var(--amber)"
            delay="0.1s"
          />
          <FeatureCard
            icon={MessageCircle}
            title="Quick Replies"
            desc="Save your most-used messages and send them with one click. Reply professionally every single time."
            color="var(--blue)"
            delay="0.2s"
          />
          <FeatureCard
            icon={Radio}
            title="Broadcast Messages"
            desc="Send announcements, promos, or updates to all your customers at once without the stress."
            color="var(--purple)"
            delay="0.3s"
          />
          <FeatureCard
            icon={Zap}
            title="Instant WhatsApp Links"
            desc="Click any customer's number to open WhatsApp Web directly. Zero extra steps, maximum speed."
            color="var(--green)"
            delay="0.4s"
          />
          <FeatureCard
            icon={Star}
            title="Revenue Dashboard"
            desc="See your total revenue, active orders, and customer growth all in one beautiful dashboard."
            color="var(--amber)"
            delay="0.5s"
          />
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="lp-section lp-problem-section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <div className="lp-section-label">The Problem</div>
            <h2 className="lp-section-title" style={{ textAlign: 'left', fontSize: '1.8rem' }}>
              Sound familiar? 😩
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
              {[
                'Customer messages get lost in the chat',
                'You forget who ordered what',
                'No way to track who has paid or not',
                'Can\'t send bulk messages easily',
                'Business looks unprofessional',
              ].map(p => (
                <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--red)', fontSize: '1rem', marginTop: 1 }}>✗</span>
                  {p}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="lp-section-label" style={{ color: 'var(--green)' }}>The Solution</div>
            <h2 className="lp-section-title" style={{ textAlign: 'left', fontSize: '1.8rem' }}>
              ClientFlow fixes all of it ✅
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
              {[
                'All customers saved with name, number & tag',
                'Every order tracked with clear status',
                'Revenue calculated automatically',
                'Broadcast messages to all customers',
                'Look like a top-level pro business',
              ].map(p => (
                <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <Check size={16} color="var(--green)" style={{ marginTop: 3, flexShrink: 0 }} />
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="lp-section">
        <div className="lp-section-label">Simple Pricing</div>
        <h2 className="lp-section-title">Start free, upgrade when ready</h2>
        <div className="lp-pricing-grid">
          {/* Free */}
          <div className="lp-price-card">
            <div className="lp-price-name">Starter</div>
            <div className="lp-price-val">Free</div>
            <div className="lp-price-period">forever</div>
            <hr className="divider" />
            {['Up to 20 customers', '50 orders/month', 'Quick replies', 'Basic dashboard'].map(f => (
              <div key={f} className="lp-price-feature"><Check size={14} color="var(--green)" /> {f}</div>
            ))}
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} onClick={() => navigate('/signup')}>
              Get Started Free
            </button>
          </div>

          {/* Pro */}
          <div className="lp-price-card lp-price-card--pro">
            <div className="lp-price-badge">Most Popular 🔥</div>
            <div className="lp-price-name">Pro</div>
            <div className="lp-price-val">₦1,500</div>
            <div className="lp-price-period">per month</div>
            <hr className="divider" />
            {['Unlimited customers', 'Unlimited orders', 'Broadcast messages', 'Revenue analytics', 'Priority support'].map(f => (
              <div key={f} className="lp-price-feature"><Check size={14} color="var(--green)" /> {f}</div>
            ))}
            <button className="lp-cta-btn" style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '12px 20px' }} onClick={() => navigate('/signup')}>
              Start Pro Trial
              <div className="lp-cta-shine" />
            </button>
          </div>

          {/* Business */}
          <div className="lp-price-card">
            <div className="lp-price-name">Business</div>
            <div className="lp-price-val">₦3,000</div>
            <div className="lp-price-period">per month</div>
            <hr className="divider" />
            {['Everything in Pro', 'Team access (3 users)', 'Custom branding', 'API access', 'Dedicated support'].map(f => (
              <div key={f} className="lp-price-feature"><Check size={14} color="var(--amber)" /> {f}</div>
            ))}
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} onClick={() => navigate('/login')}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="lp-section">
        <div className="lp-section-label">Testimonials</div>
        <h2 className="lp-section-title">What sellers are saying</h2>
        <div className="lp-testimonials">
          {[
            { name: 'Amaka D.', role: 'Fashion Designer, Lagos', quote: 'ClientFlow changed my life! I used to lose track of orders all the time. Now everything is organized and my customers think I\'m so professional 😄', avatar: 'A' },
            { name: 'Emeka O.', role: 'Graphic Designer, Abuja', quote: 'The quick replies feature alone is worth it. I send professional messages in seconds instead of typing the same thing over and over.', avatar: 'E' },
            { name: 'Fatima B.', role: 'Food Vendor, Kano', quote: 'I track all my daily orders and revenue now. I finally know how much I\'m making every week. This is a must-have for any WhatsApp seller!', avatar: 'F' },
          ].map(t => (
            <div key={t.name} className="lp-testimonial-card">
              <div style={{ display: 'flex', marginBottom: 8 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="var(--amber)" color="var(--amber)" />)}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 16 }}>
                "{t.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar" style={{ background: 'linear-gradient(135deg,var(--green),var(--blue))' }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="lp-final-cta">
        <div className="lp-orb lp-orb-cta" />
        <h2 className="lp-final-cta-title">
          Ready to run your business like a pro?
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
          Join hundreds of Nigerian sellers who use ClientFlow to stay organised, save time, and make more money.
        </p>
        <button className="lp-cta-btn lp-cta-btn--large" onClick={() => navigate('/signup')}>
          <MessageCircle size={20} />
          <span>Open ClientFlow Free</span>
          <ArrowRight size={18} />
          <div className="lp-cta-shine" />
        </button>
        <div style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          ✓ Free plan · ✓ No setup needed · ✓ Works with any WhatsApp
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div className="lp-logo-icon" style={{ width: 28, height: 28 }}>
            <MessageCircle size={16} color="#000" fill="#000" />
          </div>
          <span className="lp-logo-text" style={{ fontSize: '1rem' }}>Client<span>Flow</span></span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          © 2025 ClientFlow · Built with ❤️ for Nigerian businesses
        </p>
      </footer>
    </div>
  );
}
