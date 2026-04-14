'use client';
// components/onboarding/GuidedTour.tsx
// Step-by-step tooltip tour on the generator page

import { useState, useEffect } from 'react';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  emoji: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    target: 'category-selector',
    title: 'Step 1 — Pick a Category',
    description: 'Choose what you want to create. Each category has tailored smart fields just for that use case.',
    position: 'bottom',
    emoji: '🎯',
  },
  {
    target: 'prompt-form',
    title: 'Step 2 — Fill the Blanks',
    description: 'Answer the guided questions. The more specific you are, the better your prompt will be!',
    position: 'right',
    emoji: '✏️',
  },
  {
    target: 'generate-btn',
    title: 'Step 3 — Generate!',
    description: 'Click this button and Claude AI builds your perfect, structured prompt in seconds.',
    position: 'top',
    emoji: '⚡',
  },
  {
    target: 'prompt-output',
    title: 'Step 4 — Copy & Use',
    description: 'Your expert prompt appears here with a quality score. Copy it and paste into any AI tool!',
    position: 'left',
    emoji: '✦',
  },
];

export function GuidedTour({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  const current = TOUR_STEPS[step];

  const next = () => {
    if (step < TOUR_STEPS.length - 1) setStep(s => s + 1);
    else { setVisible(false); onComplete(); }
  };

  const skip = () => { setVisible(false); onComplete(); };

  if (!visible) return null;

  return (
    <>
      {/* Dark overlay with highlight hole */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 8000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
        pointerEvents: 'all',
      }} onClick={skip} />

      {/* Floating tooltip */}
      <div style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 8001,
        width: 300, background: 'var(--bg2)',
        border: '1px solid rgba(99,102,241,0.4)',
        borderRadius: 18, padding: '20px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 24px rgba(99,102,241,0.2)',
        pointerEvents: 'all',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            {current.emoji}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text1)' }}>{current.title}</div>
            <div style={{ fontSize: 11, color: 'var(--accent)' }}>Step {step + 1} of {TOUR_STEPS.length}</div>
          </div>
          <button onClick={skip} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 16 }}>✕</button>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65, marginBottom: 16 }}>
          {current.description}
        </p>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? '#6366f1' : 'var(--border2)', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={skip} style={{ flex: 1, padding: '9px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text3)', fontSize: 12, cursor: 'pointer' }}>Skip tour</button>
          <button onClick={next} style={{ flex: 2, padding: '9px', borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {step < TOUR_STEPS.length - 1 ? 'Next →' : 'Got it! 🚀'}
          </button>
        </div>
      </div>
    </>
  );
}
