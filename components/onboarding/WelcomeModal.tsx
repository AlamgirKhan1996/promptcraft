'use client';
// components/onboarding/WelcomeModal.tsx
// New onboarding for upgraded PromptiFill
// Shows every visit unless user clicks "Never show again"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const NEVER_KEY = 'promptifill_welcome_v3_never';

const STEPS = [
  {
    id: 1,
    emoji: '✦',
    badge: 'WELCOME',
    badgeColor: '#6366f1',
    title: 'PromptiFill just got a major upgrade',
    subtitle: 'Everything runs inside the app now',
    desc: 'No more copy-paste. No more going to Claude.ai. Generate your perfect AI prompt AND get the result — all inside PromptiFill in one click.',
    visual: 'intro',
    cta: 'Show me →',
  },
  {
    id: 2,
    emoji: '⚡',
    badge: 'GENERATE + RUN',
    badgeColor: '#6366f1',
    title: 'Generate prompt → Result appears instantly',
    subtitle: 'One click. No leaving the app.',
    desc: 'Fill in your details → PromptiFill generates the perfect structured prompt → AND immediately runs it through Claude AI → Your result appears with a typewriter effect. Done.',
    visual: 'generate',
    cta: 'Next →',
  },
  {
    id: 3,
    emoji: '🚀',
    badge: 'WEBSITE BUILDER',
    badgeColor: '#059669',
    title: 'Build complete websites — like Lovable',
    subtitle: 'Describe it → AI builds it → Live preview',
    desc: 'Go to the Build tab → describe your business → PromptiFill AI generates a FULLY FUNCTIONAL website with working navigation, forms, animations. Desktop + mobile preview. Download and deploy for $9/year.',
    visual: 'build',
    cta: 'Next →',
  },
  {
    id: 4,
    emoji: '🌍',
    badge: 'ARABIC GCC — EXCLUSIVE',
    badgeColor: '#f59e0b',
    title: 'First AI tool built for the Arab world',
    subtitle: 'Arabic RTL · GCC market · Cultural context',
    desc: 'Exclusive Arabic GCC category understands Gulf business culture, writes in Modern Standard Arabic, and builds bilingual websites with proper RTL support. Nobody else has this.',
    visual: 'arabic',
    cta: "Let's go! 🚀",
  },
];

// ── Mini visual for each step ─────────────────────────
function StepVisual({ visual }: { visual: string }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (visual === 'intro') return (
    <div style={{ padding: '12px 0' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 12, color: '#ef4444' }}>
          ❌ Old: Copy prompt → Open Claude.ai tab → Paste → Wait → Copy result → Come back
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#6366f1', fontSize: 16, margin: '6px 0' }}>↓</div>
      <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', fontSize: 12, color: '#4ade80' }}>
        ✅ New: Fill form → Click Generate → Result appears inside PromptiFill instantly ✦
      </div>
    </div>
  );

  if (visual === 'generate') return (
    <div style={{ fontSize: 12, fontFamily: 'monospace' }}>
      {/* Step indicator mini */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        {['📂 Category','✏️ Fill','⚡ Generate','✅ Result'].map((s,i) => (
          <div key={i} style={{
            flex: 1, padding: '4px 2px', borderRadius: 6, textAlign: 'center', fontSize: 9,
            background: tick % 4 === i ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
            color: tick % 4 === i ? '#818cf8' : '#334155',
            border: `1px solid ${tick % 4 === i ? 'rgba(99,102,241,0.4)' : 'transparent'}`,
            transition: 'all 0.3s',
          }}>{s}</div>
        ))}
      </div>
      <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(4,4,20,0.8)', border: '1px solid rgba(74,222,128,0.2)', lineHeight: 1.7, color: '#94a3b8' }}>
        <span style={{ color: '#818cf8' }}>ROLE:</span> Expert GCC social media strategist...<br/>
        <span style={{ color: '#67e8f9' }}>CONTEXT:</span> Saudi coffee brand, Riyadh...<br/>
        <span style={{ color: '#86efac' }}>TASK:</span> Instagram caption driving sales...<br/>
        <div style={{ marginTop: 8, color: '#4ade80', fontWeight: 700 }}>
          ▶ Running... Result: "قهوة ريادة، ذوق أصيل..."
        </div>
      </div>
    </div>
  );

  if (visual === 'build') return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {['🍽️ Restaurant','👤 Portfolio','💼 Business','🛒 Store'].map((t,i) => (
          <div key={i} style={{
            padding: '4px 10px', borderRadius: 14, fontSize: 11,
            background: tick % 4 === i ? 'rgba(5,150,105,0.2)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${tick % 4 === i ? 'rgba(5,150,105,0.4)' : 'rgba(255,255,255,0.06)'}`,
            color: tick % 4 === i ? '#4ade80' : '#334155',
            transition: 'all 0.3s',
          }}>{t}</div>
        ))}
      </div>
      <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
        <div style={{ color: '#4ade80', fontWeight: 700, marginBottom: 6 }}>✦ Website Builder — Live Preview</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', marginTop: 4 }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', marginTop: 4 }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginTop: 4 }} />
          <span style={{ fontSize: 10, color: '#334155', marginLeft: 4 }}>clothes-shop.vercel.app ✓ LIVE</span>
        </div>
        <div style={{ color: '#94a3b8' }}>Working nav · Forms · Animations · Mobile ready</div>
        <div style={{ color: '#334155', marginTop: 4 }}>⬇ Download · 🚀 Deploy · $9/year domain</div>
      </div>
    </div>
  );

  if (visual === 'arabic') return (
    <div dir="rtl" style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', fontFamily: 'sans-serif' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', marginBottom: 8, letterSpacing: 0.5 }}>المحتوى العربي الخليجي — حصري</div>
      <div style={{ fontSize: 13, color: '#fef3c7', lineHeight: 1.8, marginBottom: 6 }}>
        أنشئ محتوى تسويقي احترافياً<br/>للسوق الخليجي والعربي
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['إنستغرام','واتساب','تويتر','موقع RTL'].map(t => (
          <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.2)' }}>{t}</span>
        ))}
      </div>
    </div>
  );

  return null;
}

export function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const never = localStorage.getItem(NEVER_KEY);
    if (!never) setTimeout(() => setVisible(true), 700);
  }, []);

  const close = (goTo?: string, never = false) => {
    if (never) localStorage.setItem(NEVER_KEY, 'true');
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      if (goTo) router.push(goTo);
    }, 280);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else close('/generate');
  };

  if (!visible) return null;
  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)',
      padding: 20,
      opacity: closing ? 0 : 1, transition: 'opacity 0.28s ease',
    }}>
      <div style={{
        background: '#0f1120', border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 24, width: '100%', maxWidth: 480, overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.1)',
        transform: closing ? 'scale(0.95) translateY(8px)' : 'scale(1)',
        transition: 'all 0.28s ease',
      }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: '#1e293b' }}>
          <div style={{
            height: '100%', background: `linear-gradient(90deg, ${current.badgeColor}, #22d3ee)`,
            width: `${progress}%`, transition: 'width 0.4s ease',
          }} />
        </div>

        {/* What's new badge */}
        <div style={{
          padding: '12px 20px 0', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800,
            background: `${current.badgeColor}20`, color: current.badgeColor,
            border: `1px solid ${current.badgeColor}40`, letterSpacing: 1,
          }}>
            {current.badge}
          </div>
          <button onClick={() => close()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#334155', fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: '16px 24px 20px' }}>
          {/* Emoji + title */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{current.emoji}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2, marginBottom: 4 }}>
              {current.title}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: current.badgeColor }}>
              {current.subtitle}
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.75, marginBottom: 14 }}>
            {current.desc}
          </p>

          {/* Visual */}
          <div style={{
            background: '#080812', borderRadius: 14, padding: 14,
            marginBottom: 20, border: '1px solid rgba(255,255,255,0.04)',
            minHeight: 120,
          }}>
            <StepVisual visual={current.visual} />
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                width: i === step ? 24 : 7, height: 7, borderRadius: 4, border: 'none',
                cursor: 'pointer', padding: 0, transition: 'all 0.3s',
                background: i === step ? current.badgeColor : i < step ? `${current.badgeColor}60` : '#1e293b',
              }} />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button onClick={() => close('/generate')} style={{
              flex: 1, padding: '10px', borderRadius: 10, fontSize: 13,
              background: 'transparent', border: '1px solid #1e293b',
              color: '#334155', cursor: 'pointer', fontWeight: 500,
            }}>Skip</button>
            <button onClick={next} style={{
              flex: 2, padding: '10px', borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: `linear-gradient(135deg, ${current.badgeColor}, ${current.badgeColor}cc)`,
              color: 'white', border: 'none', cursor: 'pointer',
              boxShadow: `0 4px 16px ${current.badgeColor}40`,
            }}>{current.cta}</button>
          </div>

          {/* Never show again */}
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => close('/generate', true)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 11, color: '#1e293b', textDecoration: 'underline',
              textDecorationStyle: 'dotted', textUnderlineOffset: 3,
            }}>Don't show this again</button>
          </div>
        </div>
      </div>
    </div>
  );
}
