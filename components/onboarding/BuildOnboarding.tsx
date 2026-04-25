'use client';
// components/onboarding/BuildOnboarding.tsx
// Fully updated onboarding for the NEW PromptiFill Website Builder
// No more "paste into Claude" — everything runs inside PromptiFill

import { useState, useEffect } from 'react';

const BUILD_NEVER_KEY    = 'promptifill_build_v2_never';
const BUILD_NAV_KEY      = 'promptifill_build_nav_v2_dismissed';

// ─────────────────────────────────────────────────────────
// COMPONENT 1: NEW badge on Build nav tab
// ─────────────────────────────────────────────────────────
export function BuildBadge() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const d = localStorage.getItem(BUILD_NAV_KEY);
    setShow(!d);
  }, []);

  if (!show) return null;

  return (
    <>
      <span
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          localStorage.setItem(BUILD_NAV_KEY, 'true');
          setShow(false);
        }}
        style={{
          position: 'absolute', top: -5, right: -5,
          background: 'linear-gradient(135deg, #059669, #22d3ee)',
          color: 'white', fontSize: 8, fontWeight: 800,
          padding: '2px 5px', borderRadius: 5,
          letterSpacing: 0.3, lineHeight: 1, cursor: 'pointer',
          zIndex: 10, animation: 'pulse-new 2s ease-in-out infinite',
          boxShadow: '0 2px 8px rgba(5,150,105,0.6)',
          userSelect: 'none',
        }}
      >NEW</span>
      <style>{`
        @keyframes pulse-new {
          0%,100%{transform:scale(1);box-shadow:0 2px 8px rgba(5,150,105,0.5)}
          50%{transform:scale(1.15);box-shadow:0 2px 14px rgba(5,150,105,0.9)}
        }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// COMPONENT 2: Build page onboarding modal
// 5 steps explaining the new Lovable-style builder
// ─────────────────────────────────────────────────────────

const BUILD_STEPS = [
  {
    emoji: '🚀',
    badge: 'WEBSITE BUILDER',
    badgeColor: '#059669',
    title: 'Build complete websites with AI',
    subtitle: 'Like Lovable — but for the Arab world',
    desc: 'PromptiFill now builds fully functional websites instantly. No copy-paste. No leaving the app. Describe your business → AI generates everything → Live preview appears.',
    highlight: 'Lovable costs $20+/month. PromptiFill: $9.99/month. You save $195/year.',
    visual: 'overview',
  },
  {
    emoji: '✏️',
    badge: 'STEP 1 OF 4',
    badgeColor: '#6366f1',
    title: 'Describe your business',
    subtitle: 'Takes 60 seconds — no technical knowledge needed',
    desc: 'Pick your website type (restaurant, portfolio, business, eCommerce, SaaS...). Enter your brand name and describe your business in plain language. Choose your design style and features.',
    highlight: 'The more detail you give → the better the website. Plain English works perfectly.',
    visual: 'form',
  },
  {
    emoji: '⚡',
    badge: 'STEP 2 OF 4',
    badgeColor: '#6366f1',
    title: 'PromptiFill AI builds it instantly',
    subtitle: 'No copy-paste. No Claude.ai. No leaving the app.',
    desc: 'Click "Build My Website". PromptiFill AI generates a complete, fully functional website with working navigation, forms, animations, mobile responsive design — all inside the app in 30 seconds.',
    highlight: 'Every button works. Every form validates. Every animation runs. It\'s a real website.',
    visual: 'building',
  },
  {
    emoji: '👁️',
    badge: 'STEP 3 OF 4',
    badgeColor: '#059669',
    title: 'Live preview — desktop & mobile',
    subtitle: 'See exactly what your visitors will see',
    desc: 'Your website appears in a live preview panel instantly. Switch between desktop and mobile view. Click through pages. Test the navigation, forms, animations. Everything works in the preview.',
    highlight: 'Click the hamburger menu. Fill the contact form. Click all buttons — they all work!',
    visual: 'preview',
  },
  {
    emoji: '🌐',
    badge: 'STEP 4 OF 4',
    badgeColor: '#f59e0b',
    title: 'Download → Deploy → $9 domain',
    subtitle: 'Professional website live in under 30 minutes',
    desc: 'Download your HTML file with one click. Upload to GitHub (free). Connect to Vercel (free hosting). Add a $9/year domain from Namecheap. Your professional website is live forever.',
    highlight: 'Total cost: $9/year. Wix: $204/year. Webflow: $276/year. You save $195.',
    visual: 'deploy',
  },
];

export function BuildPageModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep]   = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const never = localStorage.getItem(BUILD_NEVER_KEY);
    if (!never) setTimeout(() => setVisible(true), 600);
  }, []);

  const close = (never = false) => {
    if (never) localStorage.setItem(BUILD_NEVER_KEY, 'true');
    setClosing(true);
    setTimeout(() => { setVisible(false); setClosing(false); }, 280);
  };

  const next = () => {
    if (step < BUILD_STEPS.length - 1) setStep(s => s + 1);
    else close(false);
  };

  if (!visible) return null;
  const current = BUILD_STEPS[step];
  const isLast  = step === BUILD_STEPS.length - 1;
  const progress = ((step + 1) / BUILD_STEPS.length) * 100;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)',
      padding: '20px',
      opacity: closing ? 0 : 1, transition: 'opacity 0.28s ease',
    }}>
      <div style={{
        background: '#0f1120',
        border: `1px solid ${current.badgeColor}40`,
        borderRadius: 24, width: '100%', maxWidth: 500, overflow: 'hidden',
        boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 40px ${current.badgeColor}15`,
        transform: closing ? 'scale(0.95) translateY(8px)' : 'scale(1)',
        transition: 'all 0.28s ease',
      }}>

        {/* Progress bar */}
        <div style={{ height: 3, background: '#1e293b' }}>
          <div style={{
            height: '100%',
            background: `linear-gradient(90deg, ${current.badgeColor}, #22d3ee)`,
            width: `${progress}%`, transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Step emoji tabs */}
        <div style={{
          display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          {BUILD_STEPS.map((s, i) => (
            <button key={i} onClick={() => setStep(i)} style={{
              flex: 1, padding: '10px 4px', border: 'none', cursor: 'pointer',
              background: i === step ? `${s.badgeColor}12` : 'transparent',
              borderBottom: i === step ? `2px solid ${s.badgeColor}` : '2px solid transparent',
              fontSize: 18, transition: 'all 0.2s',
              opacity: i > step ? 0.4 : 1,
            }}>{s.emoji}</button>
          ))}
        </div>

        <div style={{ padding: '22px 24px 20px' }}>

          {/* Badge + title */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800,
              background: `${current.badgeColor}20`, color: current.badgeColor,
              border: `1px solid ${current.badgeColor}40`, letterSpacing: 1, marginBottom: 10,
            }}>{current.badge}</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2, marginBottom: 4 }}>
              {current.title}
            </div>
            <div style={{ fontSize: 12, color: current.badgeColor, fontWeight: 600 }}>
              {current.subtitle}
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.75, marginBottom: 12 }}>
            {current.desc}
          </p>

          {/* Highlight box */}
          <div style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 18,
            background: `${current.badgeColor}10`,
            border: `1px solid ${current.badgeColor}25`,
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>💡</span>
            <span style={{ fontSize: 12, color: current.badgeColor, fontWeight: 600, lineHeight: 1.55 }}>
              {current.highlight}
            </span>
          </div>

          {/* Visual mini diagram */}
          <BuildVisual visual={current.visual} color={current.badgeColor} step={step} />

          {/* Dot nav */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '16px 0 14px' }}>
            {BUILD_STEPS.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                width: i === step ? 24 : 7, height: 7, borderRadius: 4,
                border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s',
                background: i === step ? current.badgeColor : i < step ? `${current.badgeColor}50` : '#1e293b',
              }} />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button onClick={() => close(false)} style={{
              flex: 1, padding: '10px', borderRadius: 10, fontSize: 13,
              background: 'transparent', border: '1px solid #1e293b',
              color: '#334155', cursor: 'pointer', fontWeight: 500,
            }}>{isLast ? 'Close' : 'Skip'}</button>
            <button onClick={next} style={{
              flex: 2, padding: '10px', borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: `linear-gradient(135deg, ${current.badgeColor}, ${current.badgeColor}bb)`,
              color: 'white', border: 'none', cursor: 'pointer',
              boxShadow: `0 4px 16px ${current.badgeColor}35`,
            }}>
              {isLast ? "Let's build! 🚀" : 'Next step →'}
            </button>
          </div>

          {/* Never show again */}
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => close(true)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 11, color: '#1e293b', textDecoration: 'underline',
              textDecorationStyle: 'dotted', textUnderlineOffset: 3, padding: '2px 6px',
            }}>Don't show this again</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Visual mini diagrams per step ───────────────────
function BuildVisual({ visual, color, step }: { visual: string; color: string; step: number }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1200);
    return () => clearInterval(t);
  }, []);

  const box = {
    padding: '12px 14px', borderRadius: 12, marginBottom: 0,
    background: '#080812', border: '1px solid rgba(255,255,255,0.04)',
    minHeight: 100,
  };

  if (visual === 'overview') return (
    <div style={box}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {[
          { val: '$9/yr', label: 'PromptiFill', color: '#4ade80' },
          { val: 'vs', label: '', color: '#334155' },
          { val: '$204/yr', label: 'Wix', color: '#f87171', strike: true },
          { val: '$276/yr', label: 'Webflow', color: '#f87171', strike: true },
        ].map((item, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: item.val === 'vs' ? 16 : 22, fontWeight: 900,
              color: item.color,
              textDecoration: (item as any).strike ? 'line-through' : 'none',
              opacity: (item as any).strike ? 0.7 : 1,
            }}>{item.val}</div>
            {item.label && <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{item.label}</div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: '#4ade80', fontWeight: 600 }}>
        You save $195+ every year ✓
      </div>
    </div>
  );

  if (visual === 'form') return (
    <div style={box}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {[
          { label: 'Type', val: '🍽️ Restaurant', done: true },
          { label: 'Brand', val: 'Qahwa House', done: true },
          { label: 'Style', val: '🌑 Dark Premium', done: tick > 1 },
          { label: 'Language', val: '🌍 Bilingual', done: tick > 2 },
        ].map((f, i) => (
          <div key={i} style={{
            padding: '7px 10px', borderRadius: 8,
            background: f.done ? `${color}10` : 'rgba(255,255,255,0.02)',
            border: `1px solid ${f.done ? `${color}30` : 'rgba(255,255,255,0.04)'}`,
            transition: 'all 0.4s',
          }}>
            <div style={{ fontSize: 9, color: '#334155', marginBottom: 2 }}>{f.label}</div>
            <div style={{ fontSize: 11, color: f.done ? '#f1f5f9' : '#1e293b', fontWeight: f.done ? 600 : 400 }}>
              {f.done ? f.val : '...'}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 8, padding: '7px', borderRadius: 8, textAlign: 'center',
        background: `linear-gradient(135deg, ${color}, ${color}aa)`,
        fontSize: 11, fontWeight: 700, color: 'white',
      }}>✦ Build My Website with PromptiFill AI</div>
    </div>
  );

  if (visual === 'building') return (
    <div style={box}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
          border: `2px solid ${color}40`, borderTopColor: color,
          animation: 'spin-b 0.7s linear infinite',
        }} />
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>
          PromptiFill AI is building your website...
        </span>
      </div>
      {[
        { icon: '🎨', text: 'Designing layout...', show: true },
        { icon: '⚡', text: 'Writing HTML + CSS...', show: tick > 1 },
        { icon: '🔧', text: 'Adding JavaScript...', show: tick > 2 },
        { icon: '📱', text: 'Making it responsive...', show: tick > 3 },
      ].map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 8px', borderRadius: 6, marginBottom: 4, fontSize: 11,
          background: item.show ? `${color}08` : 'transparent',
          color: item.show ? '#94a3b8' : '#1e293b',
          transition: 'all 0.4s',
          border: item.show ? `1px solid ${color}15` : '1px solid transparent',
        }}>
          <span>{item.icon}</span> {item.text}
        </div>
      ))}
      <style>{`@keyframes spin-b{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (visual === 'preview') return (
    <div style={box}>
      {/* Fake browser bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 10px', borderRadius: '8px 8px 0 0',
        background: '#0d0d1f', borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        {['#ef4444','#f59e0b','#22c55e'].map(c => (
          <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
        ))}
        <div style={{ flex: 1, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', fontSize: 9, color: '#334155', marginLeft: 6 }}>
          my-business.vercel.app
        </div>
        <div style={{
          fontSize: 9, padding: '1px 6px', borderRadius: 6,
          background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontWeight: 700,
        }}>✓ LIVE</div>
      </div>
      {/* Fake website content */}
      <div style={{ background: '#f8f9fa', borderRadius: '0 0 8px 8px', padding: 8 }}>
        {/* Nav */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <div style={{ width: 40, height: 8, borderRadius: 4, background: color }} />
          {['Home','About','Menu','Contact'].map(n => (
            <div key={n} style={{ padding: '2px 6px', borderRadius: 3, background: 'rgba(0,0,0,0.06)', fontSize: 8, color: '#64748b' }}>{n}</div>
          ))}
        </div>
        {/* Hero */}
        <div style={{ background: '#1a1a2e', borderRadius: 6, padding: '8px 10px', marginBottom: 6 }}>
          <div style={{ width: '60%', height: 8, borderRadius: 4, background: color, marginBottom: 4 }} />
          <div style={{ width: '80%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.1)', marginBottom: 4 }} />
          <div style={{ width: 50, height: 14, borderRadius: 6, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 7, color: 'white', fontWeight: 700 }}>Get Started</span>
          </div>
        </div>
        {/* Device switcher hint */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          <div style={{ padding: '2px 6px', borderRadius: 4, background: `${color}15`, fontSize: 9, color }}>🖥 Desktop</div>
          <div style={{ padding: '2px 6px', borderRadius: 4, background: 'rgba(0,0,0,0.04)', fontSize: 9, color: '#94a3b8' }}>📱 Mobile</div>
        </div>
      </div>
    </div>
  );

  if (visual === 'deploy') return (
    <div style={box}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        {[
          { icon: '⬇', label: 'Download', sub: '.html file', color: '#6366f1' },
          { icon: '→', label: '', sub: '', color: '#334155' },
          { icon: '🐙', label: 'GitHub', sub: 'Free repo', color: '#22d3ee' },
          { icon: '→', label: '', sub: '', color: '#334155' },
          { icon: '⚡', label: 'Vercel', sub: 'Free host', color: '#4ade80' },
          { icon: '→', label: '', sub: '', color: '#334155' },
          { icon: '🌐', label: 'Domain', sub: '$9/year', color: '#f59e0b' },
        ].map((item, i) => (
          item.label === '' ? (
            <div key={i} style={{ fontSize: 14, color: item.color }}>→</div>
          ) : (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, margin: '0 auto 4px',
                background: `${item.color}15`, border: `1px solid ${item.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>{item.icon}</div>
              <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 9, color: item.color }}>{item.sub}</div>
            </div>
          )
        ))}
      </div>
      <div style={{
        padding: '7px 10px', borderRadius: 8, textAlign: 'center',
        background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
        fontSize: 11, color: '#4ade80', fontWeight: 600,
      }}>
        🎉 Professional website live — Total cost: $9/year
      </div>
    </div>
  );

  return null;
}
