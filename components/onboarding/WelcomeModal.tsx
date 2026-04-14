'use client';
// components/onboarding/WelcomeModal.tsx
// Shows EVERY time user visits (unless they click "Never show again")
// "Never show again" = permanent dismiss stored in localStorage

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const NEVER_SHOW_KEY = 'promptifill_welcome_never';

const STEPS = [
  {
    id: 1,
    emoji: '✦',
    title: 'Welcome to PromptiFill!',
    subtitle: 'Perfect AI prompts in 30 seconds',
    description: 'Most people get bad AI results because their prompts are weak. PromptiFill fixes that automatically — no prompt engineering knowledge needed.',
    visual: 'intro',
    cta: 'Show me how →',
  },
  {
    id: 2,
    emoji: '1️⃣',
    title: 'Pick Your Category',
    subtitle: '10 specialized categories',
    description: 'Choose what you want to create — Social Media, Business Strategy, Coding, Arabic GCC content, and 6 more. Each category has its own smart form built for that use case.',
    visual: 'categories',
    cta: 'Got it, next →',
  },
  {
    id: 3,
    emoji: '2️⃣',
    title: 'Fill In The Blanks',
    subtitle: '5–8 smart guided fields',
    description: 'Answer simple questions about your goal, audience, and tone. No writing skills needed — just fill in what you know. PromptiFill handles the rest.',
    visual: 'form',
    cta: 'Almost there →',
  },
  {
    id: 4,
    emoji: '3️⃣',
    title: 'Get a Perfect Prompt',
    subtitle: 'Expert-level, structured, ready to copy',
    description: 'Claude AI generates a professional prompt with role, context, task, format, tone, and constraints — all built in. Plus a quality score out of 10!',
    visual: 'output',
    cta: "Let's go! 🚀",
  },
];

const CATEGORY_DEMOS = [
  { emoji: '💼', name: 'Business', color: '#6366f1' },
  { emoji: '📱', name: 'Social Media', color: '#22d3ee' },
  { emoji: '💻', name: 'Coding', color: '#4ade80' },
  { emoji: '🌍', name: 'Arabic GCC', color: '#f59e0b' },
  { emoji: '📧', name: 'Email', color: '#f472b6' },
  { emoji: '🛒', name: 'eCommerce', color: '#a78bfa' },
];

function StepVisual({ visual }: { visual: string }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1200);
    return () => clearInterval(t);
  }, []);

  if (visual === 'intro') return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#ef4444', marginBottom: 10, fontFamily: 'monospace' }}>
        ❌ "write me a marketing post"
      </div>
      <div style={{ fontSize: 18, color: 'var(--accent)', margin: '6px 0' }}>↓ PromptiFill ↓</div>
      <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', fontSize: 12, color: '#4ade80', fontFamily: 'monospace', textAlign: 'left', lineHeight: 1.6 }}>
        ✅ Act as a GCC social media expert...<br/>
        Context: Saudi audience, 25-35...<br/>
        Task: Instagram caption for...<br/>
        Format: 150 words, 3 hashtags...<br/>
        <span style={{ color: '#6366f1', fontWeight: 700 }}>Score: 9/10 ⭐</span>
      </div>
    </div>
  );

  if (visual === 'categories') return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {CATEGORY_DEMOS.map((cat, i) => (
        <div key={cat.name} style={{
          padding: '12px 8px', borderRadius: 10, textAlign: 'center',
          background: `${cat.color}10`, border: `1px solid ${cat.color}30`,
          transform: tick % 6 === i ? 'scale(1.06)' : 'scale(1)',
          transition: 'all 0.3s',
          boxShadow: tick % 6 === i ? `0 0 14px ${cat.color}30` : 'none',
        }}>
          <div style={{ fontSize: 20, marginBottom: 3 }}>{cat.emoji}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text2)' }}>{cat.name}</div>
        </div>
      ))}
    </div>
  );

  if (visual === 'form') return (
    <div>
      {[
        { label: 'What is your product?', value: 'Saudi specialty coffee', done: true },
        { label: 'Target audience?', value: 'Professionals, 25-35', done: true },
        { label: 'Platform?', value: 'Instagram', done: tick > 1 },
        { label: 'Goal?', value: 'Drive foot traffic', done: tick > 3 },
      ].map((field) => (
        <div key={field.label} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3 }}>{field.label}</div>
          <div style={{
            padding: '7px 10px', borderRadius: 7, fontSize: 12,
            background: 'var(--bg)',
            border: `1px solid ${field.done ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
            color: field.done ? 'var(--text1)' : 'var(--text3)',
            transition: 'all 0.4s', minHeight: 30,
          }}>
            {field.done ? field.value : '...'}
          </div>
        </div>
      ))}
    </div>
  );

  if (visual === 'output') return (
    <div>
      <div style={{ padding: '12px', borderRadius: 10, background: 'var(--bg)', border: '1px solid rgba(99,102,241,0.3)', marginBottom: 10, fontSize: 11, fontFamily: 'monospace', color: 'var(--text2)', lineHeight: 1.7, maxHeight: 100, overflow: 'hidden' }}>
        <span style={{ color: '#6366f1' }}>ROLE:</span> Act as a GCC social media expert...<br/>
        <span style={{ color: '#22d3ee' }}>CONTEXT:</span> Saudi coffee brand targeting...<br/>
        <span style={{ color: '#4ade80' }}>TASK:</span> Create an Instagram caption...
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <span style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>Quality Score</span>
        <span style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(90deg, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>9/10</span>
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
    // Only skip if user clicked "Never show again"
    const neverShow = localStorage.getItem(NEVER_SHOW_KEY);
    if (!neverShow) {
      setTimeout(() => setVisible(true), 600);
    }
  }, []);

  const close = (goToGenerator = false, neverShow = false) => {
    if (neverShow) localStorage.setItem(NEVER_SHOW_KEY, 'true');
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      if (goToGenerator) router.push('/generate');
    }, 280);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else close(true);
  };

  if (!visible) return null;
  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)',
      padding: 20,
      opacity: closing ? 0 : 1,
      transition: 'opacity 0.28s ease',
    }}>
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: 24, width: '100%', maxWidth: 460,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.12)',
        overflow: 'hidden',
        transform: closing ? 'scale(0.95) translateY(8px)' : 'scale(1) translateY(0)',
        transition: 'all 0.28s ease',
      }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--border)' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #22d3ee)', width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>

        <div style={{ padding: '24px 24px 20px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>{current.emoji}</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text1)', lineHeight: 1.2 }}>{current.title}</div>
                <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginTop: 2 }}>{current.subtitle}</div>
              </div>
            </div>
            <button onClick={() => close(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 18, padding: 4, lineHeight: 1 }}>✕</button>
          </div>

          {/* Description */}
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16 }}>
            {current.description}
          </p>

          {/* Visual */}
          <div style={{ background: 'var(--bg3)', borderRadius: 14, padding: 14, marginBottom: 20, border: '1px solid var(--border)', minHeight: 150 }}>
            <StepVisual visual={current.visual} />
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                width: i === step ? 22 : 7, height: 7, borderRadius: 4,
                background: i === step ? '#6366f1' : i < step ? 'rgba(99,102,241,0.4)' : 'var(--border2)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s',
              }} />
            ))}
          </div>

          {/* Main buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button onClick={() => close(true)} style={{
              flex: 1, padding: '11px', borderRadius: 10,
              background: 'transparent', border: '1px solid var(--border2)',
              color: 'var(--text3)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>
              Skip tour
            </button>
            <button onClick={next} style={{
              flex: 2, padding: '11px', borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', fontSize: 14, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
            }}>
              {current.cta}
            </button>
          </div>

          {/* Never show again — subtle at bottom */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => close(false, true)}
              style={{
                background: 'transparent', border: 'none',
                cursor: 'pointer', fontSize: 12,
                color: 'var(--text3)', textDecoration: 'underline',
                textDecorationStyle: 'dotted', textUnderlineOffset: 3,
                padding: '4px 8px',
              }}
            >
              Don't show this again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
