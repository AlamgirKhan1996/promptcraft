'use client';
// components/onboarding/BuildOnboarding.tsx
// Two components:
// 1. BuildNavTooltip — small "NEW" badge + hover tooltip on navbar Build link
// 2. BuildPageModal — popup on /build page explaining the feature

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const BUILD_NEVER_KEY = 'promptifill_build_never';
const BUILD_NAV_DISMISSED_KEY = 'promptifill_build_nav_dismissed';

// ─────────────────────────────────────────────
// COMPONENT 1: Navbar tooltip on "Build" link
// ─────────────────────────────────────────────
export function BuildNavTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = localStorage.getItem(BUILD_NAV_DISMISSED_KEY);
    setDismissed(!!d);
  }, []);

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem(BUILD_NAV_DISMISSED_KEY, 'true');
    setDismissed(true);
    setShowTooltip(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {/* NEW badge — only shows until dismissed */}
      {!dismissed && (
        <div
          style={{
            position: 'absolute', top: -6, right: -6, zIndex: 10,
            background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
            color: 'white', fontSize: 8, fontWeight: 800,
            padding: '2px 5px', borderRadius: 6,
            letterSpacing: 0.5, lineHeight: 1,
            animation: 'pulse-badge 2s ease-in-out infinite',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(99,102,241,0.5)',
          }}
          onClick={dismiss}
        >NEW</div>
      )}

      {/* The tooltip on hover */}
      {showTooltip && (
        <div style={{
          position: 'absolute', top: '140%', left: '50%',
          transform: 'translateX(-50%)',
          width: 240, background: 'var(--bg2)',
          border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: 14, padding: '14px 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 200,
          animation: 'fadeSlideDown 0.2s ease',
        }}>
          {/* Arrow */}
          <div style={{
            position: 'absolute', top: -6, left: '50%',
            width: 10, height: 10, background: 'var(--bg2)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderBottom: 'none', borderRight: 'none',
            transform: 'translateX(-50%) rotate(45deg)',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>🚀</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text1)' }}>Build With Claude AI</span>
            <span style={{ marginLeft: 'auto', fontSize: 9, background: 'rgba(99,102,241,0.2)', color: 'var(--accent)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>NEW</span>
          </div>

          <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 10 }}>
            Build a real website for <strong style={{ color: '#4ade80' }}>$9/year</strong> using AI prompts + Claude + Vercel. No coding experience needed!
          </p>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {['Portfolio', 'Business', 'Restaurant', 'Arabic RTL'].map(t => (
              <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.2)' }}>{t}</span>
            ))}
          </div>

          <div style={{ fontSize: 11, color: 'var(--text3)' }}>
            vs Wix ($204/yr) · Webflow ($276/yr)
          </div>
        </div>
      )}

      {/* Wrapper for hover events */}
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ display: 'contents' }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT 2: Build page onboarding popup
// ─────────────────────────────────────────────
const BUILD_STEPS = [
  {
    emoji: '🎯',
    title: 'What is Build With Claude?',
    desc: 'A free tool that generates the perfect AI prompt to build any website — then walks you through deploying it live for just $9/year.',
    highlight: 'No coding experience needed. Works for everyone.',
    color: '#6366f1',
  },
  {
    emoji: '✦',
    title: 'Step 1 — Generate Your Prompt',
    desc: 'Fill in 7 smart fields: website type, tech stack, pages, style, features, and description. PromptiFill creates a professional, structured prompt.',
    highlight: 'Takes 60 seconds. Completely free.',
    color: '#6366f1',
  },
  {
    emoji: '🤖',
    title: 'Step 2 — Claude Builds Your Site',
    desc: 'Copy the generated prompt → paste into Claude.ai (free tier) → Claude writes your complete website code. HTML, CSS, JavaScript — everything.',
    highlight: 'Claude writes production-ready code from your prompt.',
    color: '#22d3ee',
  },
  {
    emoji: '⚡',
    title: 'Step 3 — Deploy Free on Vercel',
    desc: 'Save the code Claude gives you → push to GitHub → connect to Vercel → your website is live on the internet in under 2 minutes. Free forever.',
    highlight: 'vercel.com — free hosting, free SSL, free CDN.',
    color: '#4ade80',
  },
  {
    emoji: '🌐',
    title: 'Step 4 — Add a $9 Domain',
    desc: 'Get a professional .com domain from Namecheap for ~$9/year. Connect it to Vercel in 30 minutes. Your site goes from yoursite.vercel.app to yoursite.com.',
    highlight: 'Total cost: $9/year. Wix costs $204/year. You save $195.',
    color: '#f59e0b',
  },
];

export function BuildPageModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const never = localStorage.getItem(BUILD_NEVER_KEY);
    if (!never) {
      setTimeout(() => setVisible(true), 500);
    }
  }, []);

  const close = (never = false) => {
    if (never) localStorage.setItem(BUILD_NEVER_KEY, 'true');
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 280);
  };

  const next = () => {
    if (step < BUILD_STEPS.length - 1) setStep(s => s + 1);
    else close(false);
  };

  if (!visible) return null;

  const current = BUILD_STEPS[step];
  const isLast = step === BUILD_STEPS.length - 1;
  const progress = ((step + 1) / BUILD_STEPS.length) * 100;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      padding: 20,
      opacity: closing ? 0 : 1, transition: 'opacity 0.28s ease',
    }}>
      <div style={{
        background: 'var(--bg2)',
        border: `1px solid ${current.color}40`,
        borderRadius: 24, width: '100%', maxWidth: 480,
        boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 40px ${current.color}15`,
        overflow: 'hidden',
        transform: closing ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.28s ease',
      }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--border)' }}>
          <div style={{ height: '100%', background: `linear-gradient(90deg, #6366f1, ${current.color})`, width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>

        {/* Step indicator pills */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
          {BUILD_STEPS.map((s, i) => (
            <button key={i} onClick={() => setStep(i)} style={{
              flex: 1, padding: '8px 4px', border: 'none', cursor: 'pointer',
              background: i === step ? `${s.color}15` : 'transparent',
              borderBottom: i === step ? `2px solid ${s.color}` : '2px solid transparent',
              fontSize: 16, transition: 'all 0.2s',
            }}>{s.emoji}</button>
          ))}
        </div>

        <div style={{ padding: '24px' }}>
          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: current.color, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
              Step {step + 1} of {BUILD_STEPS.length}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text1)', lineHeight: 1.2 }}>
              {current.title}
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 16 }}>
            {current.desc}
          </p>

          {/* Highlight box */}
          <div style={{
            padding: '12px 16px', borderRadius: 10, marginBottom: 24,
            background: `${current.color}10`,
            border: `1px solid ${current.color}30`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
            <span style={{ fontSize: 13, color: current.color, fontWeight: 600, lineHeight: 1.5 }}>
              {current.highlight}
            </span>
          </div>

          {/* Visual mini diagram for each step */}
          <div style={{ padding: '14px', background: 'var(--bg3)', borderRadius: 12, marginBottom: 24, border: '1px solid var(--border)' }}>
            {step === 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                {[['Fill blanks', '#6366f1'], ['→ Prompt', '#22d3ee'], ['→ Code', '#4ade80'], ['→ Live site!', '#f59e0b']].map(([label, color]) => (
                  <span key={label} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, background: `${color}15`, color: color as string, fontWeight: 600, border: `1px solid ${color}30` }}>{label}</span>
                ))}
              </div>
            )}
            {step === 1 && (
              <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text2)', lineHeight: 1.8 }}>
                <span style={{ color: '#6366f1' }}>ROLE:</span> Act as a senior Next.js developer...<br/>
                <span style={{ color: '#22d3ee' }}>TASK:</span> Build a restaurant website with...<br/>
                <span style={{ color: '#4ade80' }}>FORMAT:</span> Complete code, mobile-first...<br/>
                <span style={{ color: '#f59e0b' }}>FEATURES:</span> Arabic RTL, WhatsApp btn...
              </div>
            )}
            {step === 2 && (
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
                <div style={{ marginBottom: 6 }}>You → <span style={{ color: '#22d3ee' }}>Paste prompt into claude.ai</span></div>
                <div style={{ marginBottom: 6 }}>Claude → <span style={{ color: '#4ade80' }}>Writes complete HTML/CSS/JS</span></div>
                <div>You → <span style={{ color: '#6366f1' }}>Copy the code</span> → done! ✓</div>
              </div>
            )}
            {step === 3 && (
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
                <div>1. <span style={{ color: '#4ade80' }}>github.com</span> → New repo → Paste code</div>
                <div>2. <span style={{ color: '#4ade80' }}>vercel.com</span> → Import repo</div>
                <div>3. <span style={{ color: '#4ade80' }}>yoursite.vercel.app</span> → LIVE! ⚡</div>
              </div>
            )}
            {step === 4 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#ef4444', textDecoration: 'line-through' }}>$204</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Wix/year</div>
                </div>
                <div style={{ fontSize: 20, color: 'var(--text3)' }}>vs</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#4ade80' }}>$9</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>This way/year</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b' }}>$195</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>saved/year</div>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button onClick={() => close(false)} style={{
              flex: 1, padding: '11px', borderRadius: 10,
              background: 'transparent', border: '1px solid var(--border2)',
              color: 'var(--text3)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>
              {isLast ? 'Close' : 'Skip'}
            </button>
            <button onClick={next} style={{
              flex: 2, padding: '11px', borderRadius: 10,
              background: `linear-gradient(135deg, #6366f1, ${current.color === '#6366f1' ? '#4f46e5' : current.color})`,
              color: 'white', fontSize: 14, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              boxShadow: `0 4px 16px ${current.color}30`,
            }}>
              {isLast ? "Let's build! 🚀" : 'Next step →'}
            </button>
          </div>

          {/* Never show again */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => close(true)}
              style={{
                background: 'transparent', border: 'none',
                cursor: 'pointer', fontSize: 12,
                color: 'var(--text3)', textDecoration: 'underline',
                textDecorationStyle: 'dotted', textUnderlineOffset: 3,
                padding: '4px 8px',
              }}
            >Don't show this again</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes pulse-badge {
          0%, 100% { transform: scale(1); box-shadow: 0 2px 8px rgba(99,102,241,0.5); }
          50% { transform: scale(1.1); box-shadow: 0 2px 14px rgba(99,102,241,0.8); }
        }
      `}</style>
    </div>
  );
}
