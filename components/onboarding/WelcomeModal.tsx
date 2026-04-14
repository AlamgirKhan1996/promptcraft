'use client';
// components/onboarding/WelcomeModal.tsx
// Shows once to new visitors — guides them through PromptiFill
// Stores seen state in localStorage

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  {
    id: 1,
    emoji: '✦',
    title: 'Welcome to PromptiFill!',
    subtitle: 'Perfect AI prompts in 30 seconds',
    description: 'Most people get bad AI results because their prompts are weak. PromptiFill fixes that automatically — no prompt engineering knowledge needed.',
    visual: 'intro',
    cta: 'Show me how →',
    skip: 'Skip tour',
  },
  {
    id: 2,
    emoji: '1️⃣',
    title: 'Pick Your Category',
    subtitle: '10 specialized categories',
    description: 'Choose what you want to create — Social Media, Business Strategy, Coding, Arabic GCC content, and 6 more. Each category has its own smart form.',
    visual: 'categories',
    cta: 'Got it, next →',
    skip: 'Skip',
  },
  {
    id: 3,
    emoji: '2️⃣',
    title: 'Fill In The Blanks',
    subtitle: '5–8 smart guided fields',
    description: 'Answer simple questions about your goal, audience, and tone. No writing skills needed — just fill in what you know. PromptiFill handles the rest.',
    visual: 'form',
    cta: 'Almost there →',
    skip: 'Skip',
  },
  {
    id: 4,
    emoji: '3️⃣',
    title: 'Get a Perfect Prompt',
    subtitle: 'Expert-level, structured, ready to copy',
    description: 'Claude AI generates a professional prompt with role, context, task, format, tone, and constraints — all built in. Plus a quality score out of 10!',
    visual: 'output',
    cta: 'Try it now! 🚀',
    skip: null,
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
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      {/* Animated prompt transformation */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ padding: '12px 18px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#ef4444', marginBottom: 10, fontFamily: 'monospace' }}>
          ❌ "write me a marketing post"
        </div>
        <div style={{ fontSize: 20, color: 'var(--accent)', margin: '8px 0' }}>↓</div>
        <div style={{ padding: '12px 18px', borderRadius: 10, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', fontSize: 12, color: '#4ade80', fontFamily: 'monospace', textAlign: 'left', lineHeight: 1.6 }}>
          ✅ Act as a GCC social media expert...<br/>
          Context: Saudi audience, 25-35...<br/>
          Task: Instagram caption for...<br/>
          Format: 150 words, 3 hashtags...<br/>
          <span style={{ color: 'var(--accent)' }}>Score: 9/10 ⭐</span>
        </div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text3)' }}>Same AI. Better prompt. 10x better results.</div>
    </div>
  );

  if (visual === 'categories') return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '8px 0' }}>
      {CATEGORY_DEMOS.map((cat, i) => (
        <div key={cat.name} style={{
          padding: '14px 10px', borderRadius: 12, textAlign: 'center',
          background: `${cat.color}10`,
          border: `1px solid ${cat.color}30`,
          transform: tick % 6 === i ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.3s',
          boxShadow: tick % 6 === i ? `0 0 16px ${cat.color}30` : 'none',
        }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>{cat.emoji}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)' }}>{cat.name}</div>
        </div>
      ))}
    </div>
  );

  if (visual === 'form') return (
    <div style={{ padding: '8px 0' }}>
      {[
        { label: 'What is your product?', value: 'Premium Saudi coffee brand', done: true },
        { label: 'Target audience?', value: 'Saudi professionals, 25-35', done: true },
        { label: 'Platform?', value: 'Instagram', done: true },
        { label: 'Goal of post?', value: tick > 2 ? 'Drive foot traffic...' : '', done: tick > 2 },
      ].map((field, i) => (
        <div key={field.label} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>{field.label}</div>
          <div style={{
            padding: '8px 12px', borderRadius: 8, fontSize: 12,
            background: 'var(--bg)',
            border: `1px solid ${field.done ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
            color: field.done ? 'var(--text1)' : 'var(--text3)',
            transition: 'all 0.3s',
            minHeight: 34,
          }}>
            {field.value || (field.done ? '' : 'Fill in...')}
            {!field.done && tick % 2 === 0 && <span style={{ color: 'var(--accent)', animation: 'blink 1s infinite' }}>|</span>}
          </div>
        </div>
      ))}
    </div>
  );

  if (visual === 'output') return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ padding: '14px', borderRadius: 12, background: 'var(--bg)', border: '1px solid rgba(99,102,241,0.3)', marginBottom: 10, fontSize: 12, fontFamily: 'monospace', color: 'var(--text2)', lineHeight: 1.7, maxHeight: 120, overflow: 'hidden' }}>
        <span style={{ color: '#6366f1' }}>ROLE:</span> Act as a GCC social media expert...<br/>
        <span style={{ color: '#22d3ee' }}>CONTEXT:</span> Saudi coffee brand targeting...<br/>
        <span style={{ color: '#4ade80' }}>TASK:</span> Create an Instagram caption...<br/>
        <span style={{ color: '#f59e0b' }}>FORMAT:</span> 150 words max, 3 Arabic...
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>Quality Score</span>
        <span style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(90deg, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>9/10</span>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        {['⎘ Copy', '↺ Regenerate', '✦ Improve'].map(btn => (
          <div key={btn} style={{ flex: 1, padding: '7px 8px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--text3)', textAlign: 'center' }}>{btn}</div>
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
    // Show only once per browser
    const seen = localStorage.getItem('promptifill_onboarded');
    if (!seen) {
      setTimeout(() => setVisible(true), 800);
    }
  }, []);

  const close = (goToGenerator = false) => {
    setClosing(true);
    localStorage.setItem('promptifill_onboarded', 'true');
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      if (goToGenerator) router.push('/generate');
    }, 300);
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      close(true);
    }
  };

  if (!visible) return null;

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      padding: '20px',
      opacity: closing ? 0 : 1,
      transition: 'opacity 0.3s ease',
    }}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: 24, width: '100%', maxWidth: 480,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.15)',
        overflow: 'hidden',
        transform: closing ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.3s ease',
      }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--border)' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #22d3ee)', width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>

        <div style={{ padding: '28px 28px 24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {current.emoji}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text1)', lineHeight: 1.2 }}>{current.title}</div>
                <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginTop: 2 }}>{current.subtitle}</div>
              </div>
            </div>
            <button onClick={() => close(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 20, padding: 4, lineHeight: 1 }}>✕</button>
          </div>

          {/* Description */}
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20 }}>
            {current.description}
          </p>

          {/* Visual */}
          <div style={{ background: 'var(--bg3)', borderRadius: 14, padding: 16, marginBottom: 24, border: '1px solid var(--border)', minHeight: 160 }}>
            <StepVisual visual={current.visual} />
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                width: i === step ? 24 : 8, height: 8, borderRadius: 4,
                background: i === step ? '#6366f1' : i < step ? 'rgba(99,102,241,0.4)' : 'var(--border2)',
                border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                padding: 0,
              }} />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {current.skip && (
              <button onClick={() => close(true)} style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text3)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                {current.skip}
              </button>
            )}
            <button onClick={next} style={{
              flex: current.skip ? 2 : 1, padding: '12px', borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', fontSize: 14, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
            }}>
              {current.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
